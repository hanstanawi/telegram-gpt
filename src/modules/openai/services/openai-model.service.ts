import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CacheService } from 'src/core/cache/cache.service';

import openai from '../openai.lib';
import type { OpenAIModel } from '../openai.types';

const OPENAI_MODELS_CACHE = 'openai_models';
const TTL = 24 * 60 * 60 * 1000; // 24 hours in ms

@Injectable()
export class OpenAiModelService {
  private readonly openaiModelInstance = openai.models;
  private readonly logger = new Logger(OpenAiModelService.name);

  constructor(private readonly cacheService: CacheService) {}

  /**
   * @description retrieve all available OpenAI models
   * @returns {Promise<OpenAIModel[]>} OpenAI models
   */
  public async getAllModels(): Promise<OpenAIModel[]> {
    try {
      const cachedModels =
        await this.cacheService.get<OpenAIModel[]>(OPENAI_MODELS_CACHE);

      if (!cachedModels) {
        const models = await this.openaiModelInstance.list();
        await this.cacheService.set(OPENAI_MODELS_CACHE, models, TTL);
        return models.data;
      }

      return cachedModels;
    } catch (err) {
      const exception = new UnprocessableEntityException(
        'Failed getting OpenAI models',
      );
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
  }
}
