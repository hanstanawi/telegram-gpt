import { Module } from '@nestjs/common';

import {
  OpenAiAudioService,
  OpenAiChatService,
  OpenAiService,
} from './services';

@Module({
  providers: [OpenAiService, OpenAiAudioService, OpenAiChatService],
  exports: [OpenAiService, OpenAiAudioService, OpenAiChatService],
})
export class OpenAiModule {}
