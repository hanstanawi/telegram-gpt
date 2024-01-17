import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TelegramTextMessage } from 'src/common/types';
import { CharacterService } from 'src/modules/character/character.service';
import { ChatService } from 'src/modules/chat/chat.service';
import { ModelService } from 'src/modules/model/model.service';
import { VoiceService } from 'src/modules/voice/voice.service';
import { Context } from 'telegraf';

@Injectable()
export class ProfileCommand {
  private readonly logger = new Logger();

  constructor(
    private readonly chatService: ChatService,
    private readonly characterService: CharacterService,
    private readonly voiceService: VoiceService,
    private readonly modelService: ModelService,
  ) {}

  public async handleProfileCommand(
    ctx: Context,
    message: TelegramTextMessage,
  ) {
    const chat = message.from;

    try {
      if (!chat) {
        const exception = new UnprocessableEntityException(
          'Unable to find Telegram user data. Please login to Telegram before using',
        );

        this.logger.error(
          { message: exception.message, statusCode: exception.getStatus() },
          exception.stack,
        );

        throw exception;
      }

      const existingChat = await this.chatService.findOneById(chat.id);

      if (!existingChat) {
        const exception = new NotFoundException(
          'Chat data not found. Please initialize your chat bot first',
        );
        this.logger.error(exception.message, exception.stack);
        throw exception;
      }

      const characterId = existingChat.characterId;
      const voiceId = existingChat.voiceId;

      if (!characterId) {
        const exception = new NotFoundException(
          'You have not initialized your character yet. Please do a /character command first',
        );
        this.logger.error(exception.message, exception.stack);
        throw exception;
      }

      if (!voiceId) {
        const exception = new NotFoundException(
          'You have not chosen your voice profile yet. Please do a /voice command first to use voice chat',
        );
        this.logger.error(exception.message, exception.stack);
        throw exception;
      }

      const [model, character, voice] = await Promise.all([
        this.modelService.findOneByChatId(chat.id),
        this.characterService.findOneById(characterId),
        this.voiceService.findOneById(voiceId),
      ]);

      ctx.sendMessage(`
        Your Telegram-GPT profile

        - Character: ${character ? character.name : '-'}
        - Voice: ${voice ? voice.name : '-'}
        - Model: ${model ? model.name : '-'}
      `);
    } catch (err: any) {
      this.logger.error({ message: err.message, error: JSON.stringify(err) });
      return ctx.reply(`Failed handling audio message. Issue: ${err.message}`);
    }
  }
}
