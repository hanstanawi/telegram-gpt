import { Module } from '@nestjs/common';
import { CharacterModule } from 'src/modules/character/character.module';
import { ChatModule } from 'src/modules/chat/chat.module';
import { LlmModule } from 'src/modules/llm/llm.module';
import { MessageModule } from 'src/modules/message/message.module';
import { ModelModule } from 'src/modules/model/model.module';
import { OpenAiModule } from 'src/modules/openai/openai.module';
import { VoiceModule } from 'src/modules/voice/voice.module';

import { AudioCommand } from './audio/audio.command';
import { CallbackCommand } from './callback/callback.command';
import { CharacterCommand } from './character/character.command';
import { ModelCommand } from './model/model.command';
import { ProfileCommand } from './profile/profile.command';
import { ResetCommand } from './reset/reset.command';
import { StartCommand } from './start/start.command';
import { TextCommand } from './text/text.command';
import { VoiceCommand } from './voice/voice.command';

@Module({
  imports: [
    OpenAiModule,
    CharacterModule,
    ChatModule,
    LlmModule,
    MessageModule,
    ModelModule,
    VoiceModule,
  ],
  providers: [
    AudioCommand,
    CallbackCommand,
    CharacterCommand,
    ModelCommand,
    ResetCommand,
    StartCommand,
    TextCommand,
    ProfileCommand,
    VoiceCommand,
  ],
  exports: [
    AudioCommand,
    CallbackCommand,
    CharacterCommand,
    ModelCommand,
    ResetCommand,
    StartCommand,
    TextCommand,
    ProfileCommand,
    VoiceCommand,
  ],
})
export class CmdModule {}
