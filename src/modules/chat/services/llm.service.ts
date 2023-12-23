import {
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Message } from '@prisma/client';
import { isWithinTokenLimit } from 'gpt-tokenizer';
import { ROLE } from 'src/common/constants';
import { CharacterService } from 'src/modules/character/character.service';
import { MessageService } from 'src/modules/message/message.service';
import { ModelService } from 'src/modules/model/model.service';
import { CompletionMessage } from 'src/modules/openai/openai.types';
import { OpenAiChatService } from 'src/modules/openai/services';

import { getMessagesCharacters } from '../chat.utils';
import { ChatService } from './chat.service';

export const MODEL_TOKEN_LIMIT = 4096; // each gpt model has various max token val. We use the bare minimum

/**
 * @description Large Language Model (LLM) service to generate llm reply and prompt
 */
export class LLMService {
  private readonly logger = new Logger(LLMService.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly characterService: CharacterService,
    private readonly openaiChatService: OpenAiChatService,
    private readonly messageService: MessageService,
    private readonly modelService: ModelService,
  ) {}

  private async generateChatCompletionMessages(
    chatId: number,
    characterPrompt: string,
    messages: Message[],
  ) {
    const messagesCharacters = getMessagesCharacters(characterPrompt, messages);

    const isWithinTheTokenLimit = isWithinTokenLimit(
      messagesCharacters,
      MODEL_TOKEN_LIMIT,
    );

    // Some model has some token limitation.
    // Therefore, we need to restart the previous unrelated messages history
    if (!isWithinTheTokenLimit) {
      // TODO: add cache to message service
      // reset message history
      await this.messageService.removeAll(chatId);

      const lastBotMessage = messages[messages.length - 1];
      const lastUserMessage = messages[messages.length - 2];

      return [lastUserMessage, lastBotMessage];
    }

    return Promise.resolve(messages);
  }

  private async generatePrompt(chatId: number, text: string) {
    // Get messages
    const [chat, messages] = await Promise.all([
      this.chatService.findOneById(chatId),
      this.messageService.findAllByChatId(chatId),
    ]);

    if (!chat) {
      const exception = new NotFoundException(
        'Chat data not found. Please initialize your chat bot first',
      );
      this.logger.error(exception.message, exception.stack);
      throw exception;
    }

    const characterId = chat.characterId;

    if (!characterId) {
      const exception = new NotFoundException(
        'You have not initialized your character yet. Please do a /character command first',
      );
      this.logger.error(exception.message, exception.stack);
      throw exception;
    }

    const character = await this.characterService.findOneById(characterId);

    if (!character) {
      const exception = new NotFoundException(
        'You have not initialized your character yet. Please do a /character command first',
      );
      this.logger.error(exception.message, exception.stack);
      throw exception;
    }

    const chatMessages: CompletionMessage[] = [
      { role: ROLE.SYSTEM, content: character.prompt },
    ];

    if (messages.length) {
      const messagesHistory = await this.generateChatCompletionMessages(
        chatId,
        character.prompt,
        messages,
      );

      for (const msg of messagesHistory) {
        chatMessages.push({
          content: msg.text,
          role: msg.role === ROLE.USER ? ROLE.USER : ROLE.ASSISTANT,
        });
      }
    }

    chatMessages.push({ role: ROLE.USER, content: text });

    return chatMessages;
  }

  public async reply(chatId: number, text: string) {
    const messagesPrompt = await this.generatePrompt(chatId, text);

    const model = await this.modelService.findOneByChatId(chatId);

    if (!model) {
      const exception = new NotFoundException(
        'You have not initialized your model yet. Please do a /model command first',
      );
      this.logger.error(exception.message, exception.stack);
      throw exception;
    }

    const botReply = await this.openaiChatService.generateChatCompletion(
      model.name,
      messagesPrompt,
    );

    const choices = botReply.choices;

    if (!choices.length) {
      const exception = new UnprocessableEntityException('No replies from bot');
      this.logger.error(exception.message, exception.stack);
      throw exception;
    }

    const [reply] = choices;

    if (!reply.message || !reply.message.content) {
      const exception = new UnprocessableEntityException('No replies from bot');
      this.logger.error(exception.message, exception.stack);
      throw exception;
    }

    return reply.message.content;
  }
}
