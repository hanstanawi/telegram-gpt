import { Module } from '@nestjs/common';
import { ChatModule } from 'src/modules/chat/chat.module';
import { MessageModule } from 'src/modules/message/message.module';
import { ModelModule } from 'src/modules/model/model.module';
import { OpenAiModule } from 'src/modules/openai/openai.module';
import { VoiceModule } from 'src/modules/voice/voice.module';

import { CallbackCommand } from './callback/callback.command';
import { CharacterCommand } from './character/character.command';
import { CharacterModule } from './character/character.module';
import { ModelCommand } from './model/model.command';
import { ResetCommand } from './reset/reset.command';
import { StartCommand } from './start/start.command';
import { TextCommand } from './text/text.command';

@Module({
  imports: [
    OpenAiModule,
    CharacterModule,
    ChatModule,
    MessageModule,
    ModelModule,
    VoiceModule,
  ],
  providers: [
    CallbackCommand,
    CharacterCommand,
    ModelCommand,
    ResetCommand,
    StartCommand,
    TextCommand,
  ],
  exports: [
    CallbackCommand,
    CharacterCommand,
    ModelCommand,
    ResetCommand,
    StartCommand,
    TextCommand,
  ],
})
export class CmdModule {}
