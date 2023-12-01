import { Module } from '@nestjs/common';

import {
  OpenAiAudioService,
  OpenAiChatService,
  OpenAiModelService,
} from './services';

@Module({
  providers: [OpenAiModelService, OpenAiAudioService, OpenAiChatService],
  exports: [OpenAiModelService, OpenAiAudioService, OpenAiChatService],
})
export class OpenAiModule {}
