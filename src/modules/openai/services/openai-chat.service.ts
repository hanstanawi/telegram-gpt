import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';

import openai from '../openai.lib';
import type {
  ChatCompletionResult,
  CompletionMessage,
  OpenAIModel,
} from '../openai.types';

@Injectable()
export class OpenAiChatService {
  private readonly openaiChatInstance = openai.chat;
  private readonly logger = new Logger(OpenAiChatService.name);

  /**
   * @description generate chat completion with openai chat completion api
   * @param {string} model openai model id | name
   * @param {CompletionMessage[]} messages list of messages history between system and user
   * @returns {ChatCompletionResult} chat completion object data
   */
  public async generateChatCompletion(
    model: string,
    messages: CompletionMessage[],
  ): Promise<ChatCompletionResult> {
    try {
      const completion = await this.openaiChatInstance.completions.create({
        messages,
        model,
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
