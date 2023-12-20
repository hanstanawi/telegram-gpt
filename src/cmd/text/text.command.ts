import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { type TelegramTextMessage } from 'src/common/types';
import { ChatService } from 'src/modules/chat/services';
import { MessageService } from 'src/modules/message/message.service';
import { Context } from 'telegraf';

@Injectable()
export class TextCommand {
  private readonly logger = new Logger(TextCommand.name);

  constructor(
    private readonly chatService: ChatService,
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
      const [existingChat, messagesHistory] = await Promise.all([
        this.chatService.findOneById(chat.id),
        this.messageService.findAllByChatId(chat.id),
        ctx.sendChatAction('typing'), // gives better ux by showing 'typing...' message to user
      ]);

      if (!existingChat) {
        return ctx.sendMessage('Please initialize your chat bot first');
      }

      const character = existingChat.characterId;

      if (!character) {
        return ctx.sendMessage(
          'You have not initialized your character yet. Please do a /character command first',
        );
      }

      return `Hello, ${chat.first_name}`;
    } catch (err: any) {
      this.logger.error({ message: err.message, error: JSON.stringify(err) });
      return ctx.reply(`Failed retrieving models. Issue: ${err.message}`);
    }
  }
}
