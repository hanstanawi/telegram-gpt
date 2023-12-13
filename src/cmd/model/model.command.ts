import { Injectable, Logger } from '@nestjs/common';
import { SELECTION_TYPE } from 'src/common/constants';
import { TelegramTextMessage } from 'src/common/types';
import { generateArrayChunk } from 'src/common/utils';
import { transformListToKeyboardButtons } from 'src/common/utils/telegram.utils';
import { OpenAiModelService } from 'src/modules/openai/services';
import { Context } from 'telegraf';

@Injectable()
export class ModelCommand {
  private readonly logger = new Logger(ModelCommand.name);

  constructor(private readonly openAiModelService: OpenAiModelService) {}

  public async handleModelCommand(ctx: Context, message: TelegramTextMessage) {
    if (!message.text) {
      return ctx.reply('Please input a proper model command');
    }

    try {
      const models = await this.openAiModelService.getAllModels();

      if (!models.length) {
        const error = 'No available models';
        this.logger.error({ message: error });
        return ctx.reply(error);
      }

      const availableModels = transformListToKeyboardButtons(
        models,
        SELECTION_TYPE.MODEL,
      );

      return ctx.sendMessage('Select your model', {
        reply_markup: {
          inline_keyboard: generateArrayChunk(availableModels, 1),
        },
      });
    } catch (err: any) {
      this.logger.error({ message: err.message, error: JSON.stringify(err) });
      return ctx.reply(`Failed retrieving models. Issue: ${err.message}`);
    }
  }
}
