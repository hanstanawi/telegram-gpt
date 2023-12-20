import { Module } from '@nestjs/common';

import { OpenAiModule } from '../openai/openai.module';
import { ChatService, LLMService } from './services';

@Module({
  imports: [OpenAiModule],
  providers: [ChatService, LLMService],
  exports: [ChatService, LLMService],
})
export class ChatModule {}
