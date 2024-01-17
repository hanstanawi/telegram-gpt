import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';

import { CmdModule } from './cmd/cmd.module';
import { BOT_NAME } from './common/constants';
import { CoreModule } from './core/core.module';
import { BotModule } from './modules/bot/bot.module';
import { CharacterModule } from './modules/character/character.module';
import { ChatModule } from './modules/chat/chat.module';
import { LlmModule } from './modules/llm/llm.module';
import { MessageModule } from './modules/message/message.module';
import { ModelModule } from './modules/model/model.module';
import { OpenAiModule } from './modules/openai/openai.module';
import { VoiceModule } from './modules/voice/voice.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      botName: BOT_NAME,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        include: [BotModule],
        token: configService.get('TELEGRAM_BOT_TOKEN') as string,
        launchOptions:
          configService.get('NODE_ENV') === 'development'
            ? undefined
            : {
                webhook: {
                  domain: configService.get('APP_DOMAIN') as string,
                  hookPath: '/bot-callback',
                },
              },
      }),
      inject: [ConfigService],
    }),
    CoreModule,
    BotModule,
    ChatModule,
    CharacterModule,
    CmdModule,
    OpenAiModule,
    MessageModule,
    ModelModule,
    VoiceModule,
    LlmModule,
  ],
})
export class AppModule {}
