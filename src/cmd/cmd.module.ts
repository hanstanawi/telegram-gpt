import { Module } from '@nestjs/common';
import {
  ChatModule,
  MessageModule,
  ModelModule,
  OpenAiModule,
  VoiceModule,
} from 'src/modules';
import { CharacterService } from 'src/modules/character/character.service';

import { CallbackCommand } from './callback/callback.command';
import { CharacterCommand } from './character/character.command';
import { ModelCommand } from './model/model.command';
import { ResetCommand } from './reset/reset.command';
import { StartCommand } from './start/start.command';
import { TextCommand } from './text/text.command';

@Module({
  imports: [
    OpenAiModule,
    CharacterService,
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
