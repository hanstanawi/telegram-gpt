import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MessageService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * @description get all messages that belong to a chat
   * @param {number} chatId telegram chat id
   * @returns {Promise<Message[]>} list of messages history
   */
  public findAllByChatId(chatId: number): Promise<Message[]> {
    return this.databaseService.message.findMany({
      where: {
        chatId,
      },
    });
  }

  /**
   * @description
   * @param id
   * @returns
   */
  public findOne(id: string) {
    return this.databaseService.message.findUnique({
      where: {
        id,
      },
    });
  }

  public insertOne(message) {}

  public removeAll(chatId: number) {}
}
