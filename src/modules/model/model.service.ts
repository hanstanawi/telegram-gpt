import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Model } from '@prisma/client';
import { ERROR_MESSAGE } from 'src/common/constants';
import { DatabaseService } from 'src/database/database.service';
import { ZodError } from 'zod';

import {
  CreateModelDto,
  createModelSchema,
  UpdateModelDto,
  updateModelSchema,
} from './dtos';

@Injectable()
export class ModelService {
  private readonly logger = new Logger(ModelService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * @description get model data of a chat instance
   * @param {number} chatId telegram chat id
   * @returns {Promise<Model | null>} found model data
   */
  public findOneByChatId(chatId: number): Promise<Model | null> {
    return this.databaseService.model.findUnique({
      where: {
        chatId,
      },
    });
  }

  /**
   * @description create new model to db
   * @param {CreateModelDto} payload create model payload
   * @returns {Promise<Model>}
   */
  public async insertOne(payload: CreateModelDto): Promise<Model> {
    try {
      const model = createModelSchema.parse(payload);

      const createdModel = await this.databaseService.model.create({
        data: {
          name: model.name,
          source: model.source,
          chatId: model.chatId,
        },
      });

      return createdModel;
    } catch (err: any) {
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
   * @description update model by chat id
   * @param {UpdateModelDto} payload update model payload
   * @returns {Promise<Model>} updated model
   */
  public async updateOne(payload: UpdateModelDto): Promise<Model> {
    try {
      const model = updateModelSchema.parse(payload);
      const { name, source, chatId } = model;
      const existingModel = await this.findOneByChatId(chatId);

      if (!existingModel) {
        const exception = new NotFoundException(
          `Model with chat id of ${chatId} does not exist`,
        );
        this.logger.error(exception.message, exception.stack);
        throw exception;
      }

      const updatedModel = await this.databaseService.model.update({
        where: { chatId },
        data: {
          name,
          source,
        },
      });

      return updatedModel;
    } catch (err: any) {
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
   * @description remove model by chat id
   * @param {number} chatId telegram chat id
   * @returns {Promise<Model>} removed model
   */
  public async removeOne(chatId: number): Promise<Model> {
    const existingModel = await this.findOneByChatId(chatId);

    if (!existingModel) {
      const exception = new NotFoundException(
        `Model with chat id of ${chatId} does not exist`,
      );
      this.logger.error(exception.message, exception.stack);
      throw exception;
    }

    return this.databaseService.model.delete({
      where: {
        chatId,
      },
    });
  }
}
