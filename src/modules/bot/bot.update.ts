import {
  Command,
  Ctx,
  InjectBot,
  Message,
  On,
  Sender,
  Start,
  Update,
} from 'nestjs-telegraf';
import { BOT_NAME } from 'src/common/constants';
import { Context, Scenes, Telegraf } from 'telegraf';

import type { TelegramMessage, TelegramUser } from './bot.types';

@Update()
export class BotUpdate {
  constructor(
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Scenes.SceneContext>,
  ) {}

  @Start()
  async onStart(@Message() message: TelegramMessage) {
    console.log(message);
    const me = await this.bot.telegram.getMe();
    return `Hello ${me.username}`;
  }

  @Command(/model/i)
  onModelCommand(
    @Ctx() ctx: Context,
    @Message('text') text: string,
    @Sender() sender: TelegramUser,
  ) {}

  @On('text')
  async onTextMessage(
    @Ctx() ctx: Context,
    @Message('text') text: string,
    @Sender() sender: TelegramUser,
  ) {
    return `Hello, ${sender.first_name}`;
  }
}
