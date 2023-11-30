import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import type { OpenAIModel } from '../openai.types';

@Injectable()
export class OpenAiService {
  public openAiInstance: OpenAI;
  private readonly logger = new Logger(OpenAiService.name);

  constructor(configService: ConfigService) {
    this.openAiInstance = new OpenAI({
      apiKey: configService.get('OPENAI_API_KEY') as string,
    });
  }

  /**
   * @description retrieve all available OpenAI models
   * @returns {Promise<OpenAIModel[]>} OpenAI models
   */
  public async getAllModels(): Promise<OpenAIModel[]> {
    try {
      const models = await this.openAiInstance.models.list();
      return models.data;
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
