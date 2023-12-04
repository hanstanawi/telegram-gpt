import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';

import { CmdModule } from './cmd/cmd.module';
import { BOT_NAME } from './common/constants';
import { CoreModule } from './core/core.module';
import { BotModule } from './modules/bot/bot.module';
import { ChatModule } from './modules/chat/chat.module';
import { OpenAiModule } from './modules/openai/openai.module';

@Module({
  imports: [
    CoreModule,
    TelegrafModule.forRootAsync({
      botName: BOT_NAME,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        include: [BotModule],
        token: configService.get('TELEGRAM_BOT_TOKEN') as string,
      }),
      inject: [ConfigService],
    }),
    BotModule,
    ChatModule,
    CmdModule,
    OpenAiModule,
  ],
})
export class AppModule {}
