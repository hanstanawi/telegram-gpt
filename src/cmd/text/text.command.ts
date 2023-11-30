import { Injectable } from '@nestjs/common';
import { type TelegramTextMessage } from 'src/common/types';
import { Context } from 'telegraf';

@Injectable()
export class TextCommand {
  public handleTextMessage(ctx: Context, message: TelegramTextMessage) {
    const text = message.text;
    const user = message.from;

    if (!text) {
      return 'Please input a text message!';
    }

    return `Hello, ${user.first_name}`;
  }
}
