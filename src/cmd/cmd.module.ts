import { Module } from '@nestjs/common';
import { ChatModule } from 'src/modules/chat/chat.module';
import { OpenAiModule } from 'src/modules/openai/openai.module';

import { ModelCommand } from './model/model.command';
import { StartCommand } from './start/start.command';
import { TextCommand } from './text/text.command';

@Module({
  imports: [OpenAiModule, ChatModule],
  providers: [TextCommand, ModelCommand, StartCommand],
  exports: [TextCommand, ModelCommand, StartCommand],
})
export class CmdModule {}
