import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { type TelegramTextMessage } from 'src/common/types';
import { Context } from 'telegraf';

@Injectable()
export class TextCommand {
  private readonly logger = new Logger(TextCommand.name);

  public handleTextMessage(ctx: Context, message: TelegramTextMessage) {
    const text = message.text;
    const user = message.from;

    if (!text) {
      return 'Please input a text message!';
    }

    if (!user) {
      const exception = new UnprocessableEntityException(
        'Unable to find Telegram user data. Please login to Telegram before using',
      );

      this.logger.error(
        { message: exception.message, statusCode: exception.getStatus() },
        exception.stack,
      );

      throw exception;
    }

    return `Hello, ${user.first_name}`;
  }
}
