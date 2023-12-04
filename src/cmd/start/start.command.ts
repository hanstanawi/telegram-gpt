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
        // Insert new chat
        const newChat = await this.chatService.insertOne({
          id: chat.id,
          firstName: user.first_name,
          lastName: user.last_name,
        });

        this.logger.log(
          `Chat id: ${chat.id}, First name: ${newChat.firstName} start chatting`,
        );

        return `Hi I'm Samantha. What can I do for you?
          
        - To enter your character prompt. e.g. "/character I'm an assistant."
        
        - To enter your model. e.g "/model Llama"
    
        - To enter your choice of speaker e.g "/speaker 59" (Speaker must be integer)
    
        - To reset your character and bot chat history e.g "/reset"
        `;
      }

      return `Hi I'm Samantha. What can I do for you, ${existingChat.firstName}?`;
    } catch (err: any) {
      return `Failed creating chat data. Issue: ${err.message}`;
    }
  }
}
