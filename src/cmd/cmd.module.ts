import { Module } from '@nestjs/common';
import { ChatModule } from 'src/modules/chat/chat.module';
import { MessageModule } from 'src/modules/message/message.module';
import { OpenAiModule } from 'src/modules/openai/openai.module';

import { CallbackCommand } from './callback/callback.command';
import { ModelCommand } from './model/model.command';
import { ResetCommand } from './reset/reset.command';
import { StartCommand } from './start/start.command';
import { TextCommand } from './text/text.command';

@Module({
  imports: [OpenAiModule, ChatModule, MessageModule],
  providers: [
    TextCommand,
    ModelCommand,
    StartCommand,
    ResetCommand,
    CallbackCommand,
  ],
  exports: [
    TextCommand,
    ModelCommand,
    StartCommand,
    ResetCommand,
    CallbackCommand,
  ],
})
export class CmdModule {}
