import { Injectable, Logger } from '@nestjs/common';
import { SELECTION_TYPE } from 'src/common/constants';
import type { TelegramTextMessage } from 'src/common/types';
import { generateArrayChunk } from 'src/common/utils';
import { transformListToKeyboardButtons } from 'src/common/utils/telegram.utils';
import { CharacterService } from 'src/modules/character/character.service';
import { Context } from 'telegraf';

@Injectable()
export class CharacterCommand {
  private readonly logger = new Logger(CharacterCommand.name);

  constructor(private readonly characterService: CharacterService) {}

  public async handleCharacterCommand(
    ctx: Context,
    message: TelegramTextMessage,
  ) {
    if (!message.text) {
      return ctx.reply('Please input a proper character command');
    }

    try {
      const characters = await this.characterService.findAll();

      if (!characters.length) {
        const error = 'No available characters';
        this.logger.error({ message: error });
        return ctx.reply(error);
      }

      const availableCharacters = transformListToKeyboardButtons(
        characters,
        SELECTION_TYPE.CHARACTER,
      );

      return ctx.sendMessage('Select your character prompt', {
        reply_markup: {
          inline_keyboard: generateArrayChunk(availableCharacters, 1),
        },
      });
    } catch (err: any) {
      this.logger.error({ message: err.message, error: JSON.stringify(err) });
      return ctx.reply(`Failed resetting chat data. Issue: ${err.message}`);
    }
  }
}
