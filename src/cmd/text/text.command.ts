import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { type TelegramTextMessage } from 'src/common/types';
import { LLMService } from 'src/modules/chat/services';
import { Context } from 'telegraf';

@Injectable()
export class TextCommand {
  private readonly logger = new Logger(TextCommand.name);

  constructor(private readonly llmService: LLMService) {}

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
      const [botReply] = await Promise.all([
        this.llmService.reply(chat.id, text),
        ctx.sendChatAction('typing'), // gives better ux by showing 'typing...' message to user
      ]);

      await ctx.sendMessage(botReply);
    } catch (err: any) {
      this.logger.error({ message: err.message, error: JSON.stringify(err) });
      return ctx.reply(`Failed retrieving models. Issue: ${err.message}`);
    }
  }
}
