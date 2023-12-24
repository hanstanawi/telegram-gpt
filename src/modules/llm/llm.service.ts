import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Message } from '@prisma/client';
import { isWithinTokenLimit } from 'gpt-tokenizer';
import { ROLE } from 'src/common/constants';
import { MessageService } from 'src/modules/message/message.service';
import { ModelService } from 'src/modules/model/model.service';
import { CompletionMessage } from 'src/modules/openai/openai.types';
import { OpenAiChatService } from 'src/modules/openai/services';

import { ChatCompletionMessagesPayload } from './llm.types';
import { getMessagesCharacters } from './llm.utils';

export const MODEL_TOKEN_LIMIT = 4096; // each gpt model has various max token val. We use the bare minimum

/**
 * @description Large Language Model (LLM) service to generate llm reply and chat completion messages
 */
@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  constructor(
    private readonly openaiChatService: OpenAiChatService,
    private readonly messageService: MessageService,
    private readonly modelService: ModelService,
  ) {}

  private async getMessagesHistory(
    chatId: number,
    characterPrompt: string,
    messages: Message[],
  ): Promise<Message[]> {
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

  public async generateChatCompletionMessages({
    chatId,
    characterPrompt,
    text,
    messages,
  }: ChatCompletionMessagesPayload) {
    const chatMessages: CompletionMessage[] = [
      { role: ROLE.SYSTEM, content: characterPrompt },
    ];

    if (messages.length) {
      const messagesHistory = await this.getMessagesHistory(
        chatId,
        characterPrompt,
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

  public async reply(chatId: number, messages: CompletionMessage[]) {
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
      messages,
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
