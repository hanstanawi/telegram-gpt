import { Module } from '@nestjs/common';

import { StartCommand } from './start.command';

@Module({
  providers: [StartCommand],
  exports: [StartCommand],
})
export class StartCmdModule {}
