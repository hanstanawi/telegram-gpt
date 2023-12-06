import { Injectable } from '@nestjs/common';
import { TelegramTextMessage } from 'src/common/types';
import { ChatService } from 'src/modules/chat/chat.service';
import { MessageService } from 'src/modules/message/message.service';
import { ModelService } from 'src/modules/model/model.service';

@Injectable()
export class ResetCommand {
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
        this.chatService.updateOne(chat.id, {
          // Remove character choice
          id: chat.id,
          characterId: undefined,
        }),
        this.messageService.removeAll(chat.id), // Remove messages history
        this.modelService.removeOne(chat.id),
      ]);
    } catch (err: any) {
      return `Failed resetting chat data. Issue: ${err.message}`;
    }
  }
}
