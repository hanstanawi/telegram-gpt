import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { TelegramVoiceMessage } from 'src/common/types';
import { CharacterService } from 'src/modules/character/character.service';
import { ChatService } from 'src/modules/chat/chat.service';
import { LlmService } from 'src/modules/llm/llm.service';
import { MessageService } from 'src/modules/message/message.service';
import { VoiceOption } from 'src/modules/openai/openai.types';
import { OpenAiAudioService } from 'src/modules/openai/services';
import { VoiceService } from 'src/modules/voice/voice.service';
import type { Context } from 'telegraf';

@Injectable()
export class AudioCommand {
  private readonly logger = new Logger(AudioCommand.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly characterService: CharacterService,
    private readonly llmService: LlmService,
    private readonly messageService: MessageService,
    private readonly openAiAudioService: OpenAiAudioService,
    private readonly voiceService: VoiceService,
  ) {}

  private async getAudioFile(ctx: Context, fileId: string): Promise<Response> {
    try {
      const fileLink = await ctx.telegram.getFileLink(fileId);

      const res = await fetch(fileLink);
      return res;
    } catch (err: any) {
      this.logger.error({
        message: err.message,
        error: JSON.stringify(err),
      });
      throw err;
    }
  }

  private generateVoiceReply(file: ArrayBuffer) {
    return {
      source: Buffer.from(file),
    };
  }

  public async handleAudioMessage(ctx: Context, message: TelegramVoiceMessage) {
    const voiceInput = message.voice;
    const chat = message.from;

    if (!voiceInput) {
      return ctx.sendMessage('Please input a text message');
    }

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

    try {
      const [existingChat, audioFile] = await Promise.all([
        this.chatService.findOneById(chat.id),
        this.getAudioFile(ctx, voiceInput.file_id),
        ctx.sendChatAction('typing'), // gives better ux by showing 'typing...' message to user
      ]);

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

      const [character, voice, messages] = await Promise.all([
        this.characterService.findOneById(characterId),
        this.voiceService.findOneById(voiceId),
        this.messageService.findAllByChatId(chat.id),
      ]);

      if (!character) {
        const exception = new NotFoundException(
          'You have not initialized your character yet. Please do a /character command first',
        );
        this.logger.error(exception.message, exception.stack);
        throw exception;
      }

      if (!voice) {
        const exception = new NotFoundException(
          'You have not chosen your voice profile yet. Please do a /voice command first to use voice chat',
        );
        this.logger.error(exception.message, exception.stack);
        throw exception;
      }

      const transcribedText =
        await this.openAiAudioService.transcribeAudioToText(audioFile);

      const chatCompletionMessages =
        await this.llmService.generateChatCompletionMessages({
          chatId: chat.id,
          characterPrompt: character.prompt,
          messages,
          text: transcribedText,
        });

      const botReply = await this.llmService.reply(
        chat.id,
        chatCompletionMessages,
      );

      const voiceReplyFile =
        await this.openAiAudioService.synthesizeTextToSpeech(
          botReply,
          voice.name as VoiceOption,
        );

      await Promise.all([
        ctx.sendMessage(botReply),
        ctx.sendVoice(this.generateVoiceReply(voiceReplyFile)),
      ]);
    } catch (err: any) {
      this.logger.error({ message: err.message, error: JSON.stringify(err) });
      return ctx.reply(`Failed retrieving models. Issue: ${err.message}`);
    }
  }
}
