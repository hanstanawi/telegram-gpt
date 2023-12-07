import { Module } from '@nestjs/common';

import { ResetCommand } from './reset.command';

@Module({
  providers: [ResetCommand],
  exports: [ResetCommand],
})
export class ResetCmdModule {}
