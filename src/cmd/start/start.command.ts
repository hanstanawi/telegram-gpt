import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TelegramTextMessage } from 'src/common/types';
import { ChatService } from 'src/modules/chat/chat.service';

@Injectable()
export class StartCommand {
  private readonly logger = new Logger(StartCommand.name);

  constructor(private readonly chatService: ChatService) {}

  public async handleStartCommand(message: TelegramTextMessage) {
    try {
      const chat = message.chat;
      const user = message.from;

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

      const existingChat = await this.chatService.findOneById(chat.id);

      if (!existingChat) {
        const newChat = await this.chatService.insertOne({
          id: chat.id,
          firstName: user.first_name,
          lastName: user.last_name,
        });

        this.logger.log(
          `Chat id: ${chat.id}, First name: ${newChat.firstName} start chatting`,
        );

        return `Hi I'm Samantha. What can I do for you?
          
        - To view the list of character profiles, use /character command
        
        - To view the list of available models, use /model command
    
        - To view the list of voices profile for Text-to-speech, use /voice command
    
        - To reset your character and bot chat history e.g "/reset"
        `;
      }

      return `Hi I'm Samantha. What can I do for you, ${existingChat.firstName}?`;
    } catch (err: any) {
      return `Failed creating chat data. Issue: ${err.message}`;
    }
  }
}
