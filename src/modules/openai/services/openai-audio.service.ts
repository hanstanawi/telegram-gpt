import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Uploadable } from 'openai/uploads';

import openai from '../openai.lib';
import { OpenAIAudio, VoiceOption } from '../openai.types';

@Injectable()
export class OpenAiAudioService {
  private readonly openaiAudioInstance: OpenAIAudio = openai.audio;
  private readonly logger = new Logger(OpenAiAudioService.name);

  /**
   * @description Speech-to-text (STT) service to transform audio file to text
   * @param {Uploadable} file file object data like multipart form data with blob
   * @returns {Promise<string>} transcribed text
   */
  public async transcribeAudioToText(file: Uploadable): Promise<string> {
    try {
      const transcription =
        await this.openaiAudioInstance.transcriptions.create({
          model: 'whisper-1',
          file,
        });

      return transcription.text;
    } catch (err) {
      const exception = new UnprocessableEntityException(
        'Failed transcribing audio to text',
      );
      this.logger.error({
        message: exception.message,
        error: JSON.stringify(err),
        statusCode: exception.getStatus(),
      });
      throw exception;
    }
  }

  /**
   * @description Text-to-speech (TTS) service to generate audio file from text input
   * @param {string} textInput text input
   * @param {VoiceOption} voice voice options from openai. Reference https://platform.openai.com/docs/guides/text-to-speech/voice-options
   * @returns {Promise<Blob>} audio blob file
   */
  public async generateAudioFromInput(
    textInput: string,
    voice: VoiceOption,
  ): Promise<Blob> {
    try {
      const response = await this.openaiAudioInstance.speech.create({
        model: 'tts-1',
        voice,
        input: textInput,
      });

      return response.blob();
    } catch (err) {
      const exception = new UnprocessableEntityException(
        'Failed generating audio from text',
      );
      this.logger.error({
        message: exception.message,
        error: JSON.stringify(err),
        statusCode: exception.getStatus(),
      });
      throw exception;
    }
  }
}
