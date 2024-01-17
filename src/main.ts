import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { getBotToken } from 'nestjs-telegraf';

import { AppModule } from './app.module';
import { BOT_NAME } from './common/constants';

const DEFAULT_PORT = 80;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  const bot = app.get(getBotToken(BOT_NAME));
  app.use(bot.webhookCallback('/bot-callback'));

  await app.listen(process.env.PORT || DEFAULT_PORT);
}
bootstrap();
