import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';

import { CoreModule } from './core/core.module';

@Module({
  imports: [
    CoreModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get('TELEGRAM_BOT_TOKEN') as string,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
