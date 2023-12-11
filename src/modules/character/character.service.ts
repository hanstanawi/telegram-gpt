import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Character } from '@prisma/client';
import { ERROR_MESSAGE } from 'src/common/constants';
import { DatabaseService } from 'src/database/database.service';
import { ZodError } from 'zod';

import {
  CreateCharacterDto,
  createCharacterSchema,
  UpdateCharacterDto,
  updateCharacterSchema,
} from './dtos';

@Injectable()
export class CharacterService {
  private readonly logger = new Logger(CharacterService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * @description get list of predefined character prompts from db
   * @param {number} limit limit number of retrieved items (@default limit 10)
   * @returns {Promise<Character[]>} list of characters
   */
  public findAll(limit: number = 10): Promise<Character[]> {
    return this.databaseService.character.findMany({
      take: limit,
    });
  }

  /**
   * @description get character data by character id
   * @param {string} id character prompt id
   * @returns {Promise<Character | null>} retrieved character data, null if not found
   */
  public findOneById(id: string): Promise<Character | null> {
    return this.databaseService.character.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * @description insert new character record to db
   * @param {CreateCharacterDto} payload create character payload
   * @returns {Promise<Character>} created character from db
   */
  public async createOne(payload: CreateCharacterDto): Promise<Character> {
    try {
      const character = createCharacterSchema.parse(payload);

      const createdCharacter = await this.databaseService.character.create({
        data: {
          name: character.name,
          prompt: character.prompt,
        },
      });

      return createdCharacter;
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
   * @description update character data to db
   * @param {string} id character prompt id
   * @param {UpdateCharacterDto} payload update character payload
   * @returns {Promise<Character>} updated character
   */
  public async updateOne(
    id: string,
    payload: UpdateCharacterDto,
  ): Promise<Character> {
    try {
      const character = updateCharacterSchema.parse(payload);
      const { name, prompt } = character;
      const existingCharacter = await this.findOneById(id);

      if (!existingCharacter) {
        const exception = new NotFoundException(
          `Character with id of ${id} does not exist`,
        );
        this.logger.error(exception.message, exception.stack);
        throw exception;
      }

      const updatedCharacter = await this.databaseService.character.update({
        where: {
          id,
        },
        data: {
          name: name ?? undefined,
          prompt: prompt ?? undefined,
        },
      });

      return updatedCharacter;
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
   * @description remove character record from db
   * @param {string} id character id
   * @returns {Promise<Character>} deleted character
   */
  public removeOne(id: string): Promise<Character> {
    return this.databaseService.character.delete({
      where: {
        id,
      },
    });
  }
}
