import { Module } from '@nestjs/common';

import { MessageModule } from '../message/message.module';
import { OpenAiModule } from '../openai/openai.module';
import { ChatService, LLMService } from './services';

@Module({
  imports: [OpenAiModule, MessageModule],
  providers: [ChatService, LLMService],
  exports: [ChatService, LLMService],
})
export class ChatModule {}
