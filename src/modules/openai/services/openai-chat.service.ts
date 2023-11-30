import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';

import type { CompletionMessage, OpenAIModel } from '../openai.types';
import { OpenAiService } from './openai.service';

@Injectable()
export class OpenAiChatService {
  private readonly logger = new Logger(OpenAiChatService.name);

  constructor(private readonly openAiService: OpenAiService) {}

  public async generateChatCompletion(
    model: OpenAIModel,
    messages: CompletionMessage[],
  ) {
    try {
      const completion =
        await this.openAiService.openAiInstance.chat.completions.create({
          messages,
          model: model.id,
        });

      return completion;
    } catch (err) {
      const exception = new UnprocessableEntityException(
        'Failed generate chat completion',
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
