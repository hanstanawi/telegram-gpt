import {
  Command,
  Ctx,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { ModelCommand } from 'src/cmd/model/model.command';
import { TextCommand } from 'src/cmd/text/text.command';
import { BOT_NAME } from 'src/common/constants';
import type { TelegramTextMessage } from 'src/common/types';
import { Context, Scenes, Telegraf } from 'telegraf';

@Update()
export class BotUpdate {
  constructor(
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Scenes.SceneContext>,
    private readonly textCommand: TextCommand,
    private readonly modelCommand: ModelCommand,
  ) {}

  @Start()
  async onStart(@Message() message: TelegramTextMessage) {
    const user = message.from;
    return `Hello ${user.username}`;
  }

  @Command(/model/i)
  async onModelCommand(@Ctx() ctx: Context) {
    return this.modelCommand.handleModelCommand(ctx);
  }

  @On('text')
  async onTextMessage(
    @Ctx() ctx: Context,
    @Message() message: TelegramTextMessage,
  ) {
    return this.textCommand.handleTextMessage(ctx, message);
  }
}
