import { Command, Ctx, Message, On, Start, Update } from 'nestjs-telegraf';
import { AudioCommand } from 'src/cmd/audio/audio.command';
import { CallbackCommand } from 'src/cmd/callback/callback.command';
import { CharacterCommand } from 'src/cmd/character/character.command';
import { ModelCommand } from 'src/cmd/model/model.command';
import { ProfileCommand } from 'src/cmd/profile/profile.command';
import { ResetCommand } from 'src/cmd/reset/reset.command';
import { StartCommand } from 'src/cmd/start/start.command';
import { TextCommand } from 'src/cmd/text/text.command';
import { VoiceCommand } from 'src/cmd/voice/voice.command';
import type {
  TelegramTextMessage,
  TelegramVoiceMessage,
} from 'src/common/types';
import type { Context } from 'telegraf';

@Update()
export class BotUpdate {
  constructor(
    private readonly audioCommand: AudioCommand,
    private readonly callbackCommand: CallbackCommand,
    private readonly characterCommand: CharacterCommand,
    private readonly textCommand: TextCommand,
    private readonly modelCommand: ModelCommand,
    private readonly profileCommand: ProfileCommand,
    private readonly startCommand: StartCommand,
    private readonly resetCommand: ResetCommand,
    private readonly voiceCommand: VoiceCommand,
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

  @Command(/voice/i)
  public onVoiceCommand(
    @Ctx() ctx: Context,
    @Message() message: TelegramTextMessage,
  ) {
    this.voiceCommand.handleVoiceCommand(ctx, message);
  }

  @Command(/profile/i)
  public onProfileCommand(
    @Ctx() ctx: Context,
    @Message() message: TelegramTextMessage,
  ) {
    this.profileCommand.handleProfileCommand(ctx, message);
  }

  @On('text')
  public onTextMessage(
    @Ctx() ctx: Context,
    @Message() message: TelegramTextMessage,
  ) {
    this.textCommand.handleTextMessage(ctx, message);
  }

  @On('voice')
  public onVoiceMessage(
    @Ctx() ctx: Context,
    @Message() message: TelegramVoiceMessage,
  ) {
    this.audioCommand.handleAudioMessage(ctx, message);
  }

  @On('callback_query')
  public onCallbackQuery(@Ctx() ctx: Context) {
    this.callbackCommand.handleCallbackQuery(ctx);
  }
}
