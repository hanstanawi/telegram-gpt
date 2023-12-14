import { Injectable, Logger } from '@nestjs/common';
import { SELECTION_TYPE } from 'src/common/constants';
import { TelegramTextMessage } from 'src/common/types';
import { generateArrayChunk } from 'src/common/utils';
import { transformListToKeyboardButtons } from 'src/common/utils/telegram.utils';
import { VOICE_OPTIONS } from 'src/modules/voice/voice.constants';
import { Context } from 'telegraf';

@Injectable()
export class VoiceCommand {
  private readonly logger = new Logger(VoiceCommand.name);

  constructor() {}

  public async handleVoiceCommand(ctx: Context, message: TelegramTextMessage) {
    if (!message.text) {
      return ctx.reply('Please input a proper model command');
    }

    const voices = Object.values(VOICE_OPTIONS).map((voice) => {
      return {
        id: voice,
      };
    });

    if (!voices) {
      const error = 'No available models';
      this.logger.error({ message: error });
      return ctx.reply(error);
    }

    const availableVoices = transformListToKeyboardButtons(
      voices,
      SELECTION_TYPE.VOICE,
    );

    return ctx.sendMessage('Select your model', {
      reply_markup: {
        inline_keyboard: generateArrayChunk(availableVoices, 1),
      },
    });
  }
}
