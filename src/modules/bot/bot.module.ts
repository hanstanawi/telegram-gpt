import { Module } from '@nestjs/common';
import { CmdModule } from 'src/cmd/cmd.module';

import { BotUpdate } from './bot.update';

@Module({
  imports: [CmdModule],
  providers: [BotUpdate],
})
export class BotModule {}
