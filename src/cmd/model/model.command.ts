import { Injectable } from '@nestjs/common';
import { OpenAiModelService } from 'src/modules/openai/services';
import { Context } from 'telegraf';

@Injectable()
export class ModelCommand {
  constructor(private readonly openAiModelService: OpenAiModelService) {}

  public async handleModelCommand(ctx: Context) {
    const models = await this.openAiModelService.getAllModels();

    return ctx.sendMessage('Select your model', {
      reply_markup: {
        inline_keyboard: [[{ text: 'Hello', callback_data: 'hello' }]],
      },
    });
  }
}
