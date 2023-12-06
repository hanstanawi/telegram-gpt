import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Voice } from '@prisma/client';
import { ERROR_MESSAGE } from 'src/common/constants';
import { DatabaseService } from 'src/database/database.service';
import { ZodError } from 'zod';

import { CreateVoiceDto, createVoiceSchema } from './dtos';
import { UpdateVoiceDto, updateVoiceSchema } from './dtos/update-voice.dto';

@Injectable()
export class VoiceService {
  private readonly logger = new Logger(VoiceService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * @description get voice data of a chat instance
   * @param {number} chatId telegram chat id
   * @returns {Promise<Voice | null>} found voice data
   */
  public findOneByChatId(chatId: number): Promise<Voice | null> {
    return this.databaseService.voice.findUnique({
      where: {
        chatId,
      },
    });
  }

  /**
   * @description create new voice to db
   * @param {CreateVoiceDto} payload create voice payload
   * @returns {Promise<Voice>} inserted voice choice to db
   */
  public async insertOne(payload: CreateVoiceDto): Promise<Voice> {
    try {
      const voice = createVoiceSchema.parse(payload);

      const createdVoice = await this.databaseService.voice.create({
        data: {
          name: voice.name,
          chatId: voice.chatId,
        },
      });

      return createdVoice;
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
   * @description update voice by chat id
   * @param {UpdateVoiceDto} payload update voice payload
   * @returns {Promise<Voice>} updated voice data
   */
  public async updateOne(payload: UpdateVoiceDto): Promise<Voice> {
    try {
      const voice = updateVoiceSchema.parse(payload);
      const { name, chatId } = voice;
      const existingVoice = await this.findOneByChatId(chatId);

      if (!existingVoice) {
        const exception = new NotFoundException(
          `Voice with chat id of ${chatId} does not exist`,
        );
        this.logger.error(exception.message, exception.stack);
        throw exception;
      }

      const updatedVoice = await this.databaseService.voice.update({
        where: { chatId },
        data: {
          name: name ?? undefined,
        },
      });

      return updatedVoice;
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
   * @description remove voice by chat id
   * @param {number} chatId telegram chat id
   * @returns {Promise<Voice>} removed voice
   */
  public async removeOne(chatId: number): Promise<Voice> {
    const existingVoice = await this.findOneByChatId(chatId);

    if (!existingVoice) {
      const exception = new NotFoundException(
        `Voice with chat id of ${chatId} does not exist`,
      );
      this.logger.error(exception.message, exception.stack);
      throw exception;
    }

    return this.databaseService.voice.delete({
      where: {
        chatId,
      },
    });
  }
}
