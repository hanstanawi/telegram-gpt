import { Injectable } from '@nestjs/common';
import { OpenAiService } from 'src/modules/openai/services';
import { Context } from 'telegraf';

@Injectable()
export class ModelCommand {
  constructor(private readonly openAiService: OpenAiService) {}

  public async handleModelCommand(ctx: Context) {
    const models = await this.openAiService.getAllModels();

    return await ctx.sendMessage('Select your model', {
      reply_markup: {
        inline_keyboard: [],
      },
    });
  }
}
