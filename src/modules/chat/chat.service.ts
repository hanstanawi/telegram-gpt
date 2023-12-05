import { Injectable, NotFoundException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Chat } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { ZodError } from 'zod';

import {
  CreateChatDto,
  createChatSchema,
  UpdateChatDto,
  updateChatSchema,
} from './dtos';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * @description get list of chats from db
   * @param {number} limit limit number of retrieved items (@default limit 10)
   * @returns {Promise<Chat[]>} list of chats
   */
  public findAll(limit: number = 10): Promise<Chat[]> {
    return this.databaseService.chat.findMany({
      take: limit,
    });
  }

  /**
   * @description get chat data by telegram chat id
   * @param {number} id telegram chat id
   * @returns {Promise<Chat | null>} retrieved chat data, null if not found
   */
  public findOneById(id: number): Promise<Chat | null> {
    return this.databaseService.chat.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * @description insert new chat record to db
   * @param {CreateChatDto} payload create chat payload
   * @returns {Promise<Chat>} created chat from db
   */
  public async createOne(payload: CreateChatDto): Promise<Chat> {
    try {
      const chat = createChatSchema.parse(payload);

      const createdChat = await this.databaseService.chat.create({
        data: {
          id: chat.id,
          firstName: chat.firstName,
          lastName: chat.lastName ?? undefined,
        },
      });

      return createdChat;
    } catch (err) {
      if (err instanceof ZodError) {
        const exception = new ForbiddenException({
          message: err.issues.length ? err.issues[0].message : 'Bad Request',
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

      throw err;
    }
  }

  /**
   * @description update chat data to db
   * @param {number} id telegram chat id
   * @param {UpdateChatDto} payload update chat payload
   * @returns {Promise<Chat>} updated chat
   */
  public async updateOne(id: number, payload: UpdateChatDto): Promise<Chat> {
    try {
      const existingChat = await this.findOneById(id);

      if (!existingChat) {
        const exception = new NotFoundException(
          `Chat with ${id} does not exist`,
        );
        this.logger.error(exception.message, exception.stack);
        throw exception;
      }

      const chat = updateChatSchema.parse(payload);
      const updatedChat = await this.databaseService.chat.update({
        where: { id },
        data: {
          firstName: chat.firstName,
          lastName: chat.lastName,
          characterId: chat.characterId,
        },
      });

      return updatedChat;
    } catch (err) {
      if (err instanceof ZodError) {
        const exception = new ForbiddenException({
          message: err.issues.length ? err.issues[0].message : 'Bad Request',
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

      throw err;
    }
  }
}
