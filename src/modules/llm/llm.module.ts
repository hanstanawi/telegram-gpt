import { Module } from '@nestjs/common';

import { MessageModule } from '../message/message.module';
import { ModelModule } from '../model/model.module';
import { OpenAiModule } from '../openai/openai.module';
import { LlmService } from './llm.service';

@Module({
  imports: [OpenAiModule, MessageModule, ModelModule],
  providers: [LlmService],
  exports: [LlmService],
})
export class LlmModule {}
