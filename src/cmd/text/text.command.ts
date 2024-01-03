import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ROLE } from 'src/common/constants';
import { type TelegramTextMessage } from 'src/common/types';
import { CharacterService } from 'src/modules/character/character.service';
import { ChatService } from 'src/modules/chat/chat.service';
import { LlmService } from 'src/modules/llm/llm.service';
import { MessageService } from 'src/modules/message/message.service';
import { Context } from 'telegraf';

@Injectable()
export class TextCommand {
  private readonly logger = new Logger(TextCommand.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly characterService: CharacterService,
    private readonly llmService: LlmService,
    private readonly messageService: MessageService,
  ) {}

  public async handleTextMessage(ctx: Context, message: TelegramTextMessage) {
    const text = message.text;
    const chat = message.from;

    if (!text) {
      return ctx.sendMessage('Please input a text message');
    }

    if (!chat) {
      const exception = new UnprocessableEntityException(
        'Unable to find Telegram user data. Please login to Telegram before using',
      );

      this.logger.error(
        { message: exception.message, statusCode: exception.getStatus() },
        exception.stack,
      );

      throw exception;
    }

    try {
      const [existingChat, messages] = await Promise.all([
        this.chatService.findOneById(chat.id),
        this.messageService.findAllByChatId(chat.id),
        ctx.sendChatAction('typing'), // gives better ux by showing 'typing...' message to user
      ]);

      if (!existingChat) {
        const exception = new NotFoundException(
          'Chat data not found. Please initialize your chat bot first',
        );
        this.logger.error(exception.message, exception.stack);
        throw exception;
      }

      const characterId = existingChat.characterId;

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

      const chatCompletionMessages =
        await this.llmService.generateChatCompletionMessages({
          chatId: chat.id,
          characterPrompt: character.prompt,
          messages,
          text,
        });

      const botReply = await this.llmService.reply(
        chat.id,
        chatCompletionMessages,
      );

      await ctx.sendMessage(botReply);

      return this.messageService.insertMany([
        { role: ROLE.USER, text, chatId: chat.id },
        { role: ROLE.ASSISTANT, text: botReply, chatId: chat.id },
      ]);
    } catch (err: any) {
      this.logger.error({ message: err.message, error: JSON.stringify(err) });
      return ctx.reply(`Failed handling text message. Issue: ${err.message}`);
    }
  }
}
