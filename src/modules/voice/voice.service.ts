import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Voice } from '@prisma/client';
import { ERROR_MESSAGE } from 'src/common/constants';
import { CacheService } from 'src/core/cache/cache.service';
import { DatabaseService } from 'src/database/database.service';
import { ZodError } from 'zod';

import {
  CreateVoiceDto,
  createVoiceSchema,
  UpdateVoiceDto,
  updateVoiceSchema,
} from './dtos';

const CACHE_KEY = 'voices';
const TTL = 24 * 60 * 60 * 1000; // 24 hours in ms

@Injectable()
export class VoiceService {
  private readonly logger = new Logger(VoiceService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * @description get list of predefined voices from db
   * @param {number} limit limit number of retrieved items (@default limit 10)
   * @returns {Promise<Character[]>} list of voices
   */
  public async findAll(limit: number = 10): Promise<Voice[]> {
    const cachedVoices = await this.cacheService.get<Voice[]>(CACHE_KEY);

    if (cachedVoices) {
      return cachedVoices;
    }

    const res = await this.databaseService.voice.findMany({
      take: limit,
    });

    await this.cacheService.set(CACHE_KEY, res, TTL);

    return res;
  }

  /**
   * @description get voice data by character id
   * @param {string} id voice  id
   * @returns {Promise<Voice | null>} retrieved voice data, null if not found
   */
  public findOneById(id: string): Promise<Voice | null> {
    return this.databaseService.voice.findUnique({
      where: {
        id,
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
        },
      });

      // invalidate cache
      await this.cacheService.del(CACHE_KEY);

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
   * @param {string} id voice id
   * @param {UpdateVoiceDto} payload update voice payload
   * @returns {Promise<Voice>} updated voice data
   */
  public async updateOne(id: string, payload: UpdateVoiceDto): Promise<Voice> {
    try {
      const voice = updateVoiceSchema.parse(payload);
      const { name } = voice;
      const existingVoice = await this.findOneById(id);

      if (!existingVoice) {
        const exception = new NotFoundException(
          `Voice with id of ${id} does not exist`,
        );
        this.logger.error(exception.message, exception.stack);
        throw exception;
      }

      const updatedVoice = await this.databaseService.voice.update({
        where: { id },
        data: {
          name: name ?? undefined,
        },
      });

      // invalidate cache
      await this.cacheService.del(CACHE_KEY);

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
   * @param {string} id voice id
   * @returns {Promise<Voice>} removed voice
   */
  public async removeOne(id: string): Promise<Voice> {
    const existingVoice = await this.findOneById(id);

    if (!existingVoice) {
      const exception = new NotFoundException(
        `Voice with id of ${id} does not exist`,
      );
      this.logger.error(exception.message, exception.stack);
      throw exception;
    }

    return this.databaseService.voice.delete({
      where: {
        id,
      },
    });
  }
}
