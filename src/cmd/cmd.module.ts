import { Module } from '@nestjs/common';
import {
  ChatModule,
  MessageModule,
  ModelModule,
  OpenAiModule,
  VoiceModule,
} from 'src/modules';

import { CallbackCommand } from './callback/callback.command';
import { ModelCommand } from './model/model.command';
import { ResetCommand } from './reset/reset.command';
import { StartCommand } from './start/start.command';
import { TextCommand } from './text/text.command';

@Module({
  imports: [OpenAiModule, ChatModule, MessageModule, ModelModule, VoiceModule],
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
