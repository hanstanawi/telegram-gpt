import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Message } from '@prisma/client';
import { ERROR_MESSAGE } from 'src/common/constants';
import { DatabaseService } from 'src/database/database.service';
import { ZodError } from 'zod';

import { CreateMessageDto, createMessageSchema } from './dtos';
import { DeleteMessageResponse } from './message.types';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

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
   * @description find message by id
   * @param {string} id telegram message id
   * @returns {Promise<Message | null>} message
   */
  public findOneById(id: string): Promise<Message | null> {
    return this.databaseService.message.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * @description create a new message as message history
   * @param {CreateMessageDto} payload new message dto
   * @returns {Promise<Message>} new message
   */
  public async insertOne(payload: CreateMessageDto): Promise<Message> {
    try {
      const message = createMessageSchema.parse(payload);

      const createdMessage = await this.databaseService.message.create({
        data: {
          text: message.text,
          role: message.role,
          chatId: message.chatId,
        },
      });

      return createdMessage;
    } catch (err) {
      if (err instanceof ZodError) {
        const exception = new ForbiddenException({
          message: err.issues.length
            ? err.issues[0].message
            : ERROR_MESSAGE.BAD_REQUEST,
          error: err.issues,
        });

        this.logger.error(
          {
            message: exception.message,
            error: JSON.stringify(err),
            statusCode: exception.getStatus(),
          },
          exception.stack,
        );

        throw exception;
      }

      this.logger.error({
        message: err.message,
        error: JSON.stringify(err),
      });

      throw err;
    }
  }

  /**
   * @description remove all messages that belongs to a chat
   * @param {number} chatId telegram chat id
   * @returns {Promise<DeleteMessageResponse>} deleted messages count
   */
  public async removeAll(chatId: number): Promise<DeleteMessageResponse> {
    const deleted = await this.databaseService.message.deleteMany({
      where: {
        chatId,
      },
    });

    return { messagesCount: deleted.count, isDeleted: true };
  }
}
