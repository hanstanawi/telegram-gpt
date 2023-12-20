import { Injectable, Logger } from '@nestjs/common';
import { TelegramTextMessage } from 'src/common/types';
import { ChatService } from 'src/modules/chat/services';
import { MessageService } from 'src/modules/message/message.service';
import { ModelService } from 'src/modules/model/model.service';

@Injectable()
export class ResetCommand {
  private readonly logger = new Logger(ResetCommand.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly modelService: ModelService,
  ) {}

  public async handleResetCommand(message: TelegramTextMessage) {
    const chat = message.chat;

    const existingChat = await this.chatService.findOneById(chat.id);

    if (!existingChat) {
      return 'You have not initialized your bot. Run /start command to initialize.';
    }

    try {
      await Promise.all([
        // Remove character choice
        this.chatService.updateOne(chat.id, {
          id: chat.id,
          characterId: undefined,
          voiceId: undefined,
        }),
        this.messageService.removeAll(chat.id), // Remove messages history
        this.modelService.removeOne(chat.id), // Remove model data
      ]);

      this.logger.log(
        `Chat id: ${existingChat.id}, First name: ${existingChat.firstName} reset`,
      );

      return 'Your chat history, character, model preference has been reset';
    } catch (err: any) {
      return `Failed resetting chat data. Issue: ${err.message}`;
    }
  }
}
