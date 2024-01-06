import { Module } from '@nestjs/common';

import { VoiceCommand } from './voice.command';

@Module({
  providers: [VoiceCommand],
  exports: [VoiceCommand],
})
export class VoiceCmdModule {}
