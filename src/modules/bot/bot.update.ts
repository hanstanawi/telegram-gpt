import { InjectBot, Start, Update } from 'nestjs-telegraf';
import { BOT_NAME } from 'src/common/constants';
import { Scenes, Telegraf } from 'telegraf';

@Update()
export class BotUpdate {
  constructor(
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Scenes.SceneContext>,
  ) {}

  @Start()
  async onStart() {
    const me = await this.bot.telegram.getMe();
    return `Hello ${me.username}`;
  }
}
