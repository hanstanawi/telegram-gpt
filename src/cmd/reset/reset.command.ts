import { Injectable } from '@nestjs/common';
import { TelegramTextMessage } from 'src/common/types';

@Injectable()
export class ResetCommand {
  constructor() {}

  public async handleResetCommand(message: TelegramTextMessage) {}
}
