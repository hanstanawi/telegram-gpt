import { Command, Ctx, Message, On, Start, Update } from 'nestjs-telegraf';
import { CallbackCommand } from 'src/cmd/callback/callback.command';
import { CharacterCommand } from 'src/cmd/character/character.command';
import { ModelCommand } from 'src/cmd/model/model.command';
import { ResetCommand } from 'src/cmd/reset/reset.command';
import { StartCommand } from 'src/cmd/start/start.command';
import { TextCommand } from 'src/cmd/text/text.command';
import type { TelegramTextMessage } from 'src/common/types';
import type { Context } from 'telegraf';

@Update()
export class BotUpdate {
  constructor(
    private readonly callbackCommand: CallbackCommand,
    private readonly characterCommand: CharacterCommand,
    private readonly textCommand: TextCommand,
    private readonly modelCommand: ModelCommand,
    private readonly startCommand: StartCommand,
    private readonly resetCommand: ResetCommand,
  ) {}

  @Start()
  public onStart(@Message() message: TelegramTextMessage) {
    return this.startCommand.handleStartCommand(message);
  }

  @Command(/reset/i)
  public onResetCommand(@Message() message: TelegramTextMessage) {
    return this.resetCommand.handleResetCommand(message);
  }

  @Command(/model/i)
  public onModelCommand(
    @Ctx() ctx: Context,
    @Message() message: TelegramTextMessage,
  ) {
    this.modelCommand.handleModelCommand(ctx, message);
  }

  @Command(/character/i)
  public onCharacterCommand(
    @Ctx() ctx: Context,
    @Message() message: TelegramTextMessage,
  ) {
    this.characterCommand.handleCharacterCommand(ctx, message);
  }

  @On('text')
  public onTextMessage(
    @Ctx() ctx: Context,
    @Message() message: TelegramTextMessage,
  ) {
    return this.textCommand.handleTextMessage(ctx, message);
  }

  @On('callback_query')
  public onCallbackQuery(@Ctx() ctx: Context) {
    return this.callbackCommand.handleCallbackQuery(ctx);
  }
}
