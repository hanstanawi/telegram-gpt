import { Injectable, Logger } from '@nestjs/common';
import type { TelegramTextMessage } from 'src/common/types';
import { generateArrayChunk } from 'src/common/utils';
import { CharacterService } from 'src/modules/character/character.service';
import { Context } from 'telegraf';

import { transformCharactersToKeyboardButtons } from './character.utils';

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

      const availableCharacters =
        transformCharactersToKeyboardButtons(characters);

      return ctx.sendMessage('Select your character prompt', {
        reply_markup: {
          inline_keyboard: generateArrayChunk(availableCharacters),
        },
      });
    } catch (err: any) {
      this.logger.error({ message: err.message, error: JSON.stringify(err) });
      return ctx.reply(`Failed resetting chat data. Issue: ${err.message}`);
    }
  }
}
