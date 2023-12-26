import { Injectable } from '@nestjs/common';
import { TelegramTextMessage } from 'src/common/types';
import { Context } from 'telegraf';

@Injectable()
export class AudioCommand {
  constructor() {}

  public async handleAudioMessage(ctx: Context, message: TelegramTextMessage) {}
}
