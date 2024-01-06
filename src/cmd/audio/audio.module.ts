import { Module } from '@nestjs/common';

import { AudioCommand } from './audio.command';

@Module({
  providers: [AudioCommand],
  exports: [AudioCommand],
})
export class AudioCmdModule {}
