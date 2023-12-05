import { Injectable } from '@nestjs/common';
import { TelegramTextMessage } from 'src/common/types';
import { ChatService } from 'src/modules/chat/chat.service';
import { MessageService } from 'src/modules/message/message.service';

@Injectable()
export class ResetCommand {
  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
  ) {}

  public async handleResetCommand(message: TelegramTextMessage) {
    const chat = message.chat;

    const existingChat = await this.chatService.findOneById(chat.id);

    if (!existingChat) {
      return 'You have not initialized your bot. Run /start command to initialize.';
    }

    // Remove character choice
    // Remove messages history
    await Promise.all([
      this.chatService.updateOne(chat.id, {
        id: chat.id,
        characterId: undefined,
      }),
      this.messageService.removeAll(chat.id),
    ]);
  }
}
