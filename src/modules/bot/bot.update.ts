import { Ctx, InjectBot, Message, On, Start, Update } from 'nestjs-telegraf';
import { TextCommand } from 'src/cmd/text/text.command';
import { BOT_NAME } from 'src/common/constants';
import type { TelegramTextMessage } from 'src/common/types';
import { Context, Scenes, Telegraf } from 'telegraf';

@Update()
export class BotUpdate {
  constructor(
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Scenes.SceneContext>,
    private readonly textCommand: TextCommand,
  ) {}

  @Start()
  async onStart(@Message() message: TelegramTextMessage) {
    const user = message.from;
    return `Hello ${user.username}`;
  }

  @On('text')
  async onTextMessage(
    @Ctx() ctx: Context,
    @Message() message: TelegramTextMessage,
  ) {
    return this.textCommand.handleTextMessage(ctx, message);
  }
}
