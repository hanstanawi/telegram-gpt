import { Injectable, Logger } from '@nestjs/common';
import { SELECTION_TYPE } from 'src/common/constants';
import type { CallbackData, CallbackDataQuery } from 'src/common/types';
import { parseJson } from 'src/common/utils';
import { CharacterService } from 'src/modules/character/character.service';
import { ChatService } from 'src/modules/chat/services';
import { ModelService } from 'src/modules/model/model.service';
import { VoiceService } from 'src/modules/voice/voice.service';
import type { Context } from 'telegraf';

@Injectable()
export class CallbackCommand {
  private readonly logger = new Logger(CallbackCommand.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly characterService: CharacterService,
    private readonly modelService: ModelService,
    private readonly voiceService: VoiceService,
  ) {}

  /**
   * @description This callback query service is triggered when inline keyboard option is selected
   * Currently we have three commands that have inline keyboard options:
   * - /model - to choose LLM model preference
   * - /character - to choose predefined character prompt
   * - /voice - to choose TTS voice preference
   *
   * This service will handle the user selection based on the command by checking
   * the `query.callback_data` JSON string for the selection type.
   *
   * `type CallbackData<T> = { data: T, type: 'model' | 'character' | 'speaker' }`
   *
   * Then store the selected option to database
   * @param {Context} ctx telegram chat context
   * @returns bot message
   */
  public async handleCallbackQuery(ctx: Context) {
    if (!ctx.has('callback_query')) {
      return ctx.sendMessage('Invalid callback query command');
    }

    const callbackQuery = ctx.update.callback_query as CallbackDataQuery;

    if (!callbackQuery.message) {
      return ctx.sendMessage('Please provide proper message');
    }

    const chat = callbackQuery.message.chat;
    const existingChat = await this.chatService.findOneById(chat.id);

    if (!existingChat) {
      return ctx.sendMessage('Please initialize your chat bot first');
    }

    const callbackData = callbackQuery.data;

    if (!callbackData) {
      return ctx.sendMessage('Command data is invalid');
    }

    const parsedCallbackData = parseJson<CallbackData<string>>(callbackData);

    if (!parsedCallbackData || parsedCallbackData === undefined) {
      return ctx.sendMessage('Option is not available. Please try again.');
    }

    try {
      switch (parsedCallbackData.type) {
        case SELECTION_TYPE.CHARACTER: {
          const characterId = parsedCallbackData.data;
          const character =
            await this.characterService.findOneById(characterId);

          if (!character) {
            return ctx.sendMessage(`Selected character prompt does not exist`);
          }

          await this.chatService.updateOne(chat.id, {
            id: chat.id,
            characterId,
          });

          this.logger.log(
            `Chat id: ${chat.id}, First name: ${existingChat.firstName} enter ${character.name} as character prompt`,
          );

          return ctx.sendMessage(`You selected ${character.name} model`);
        }
        case SELECTION_TYPE.MODEL: {
          const modelName = parsedCallbackData.data;
          const existingModel = await this.modelService.findOneByChatId(
            chat.id,
          );

          if (!existingModel) {
            const createdModel = await this.modelService.insertOne({
              name: modelName,
              source: 'openai', // for now it's only openai models
              chatId: chat.id,
            });

            this.logger.log(
              `Chat id: ${chat.id}, First name: ${existingChat.firstName} created ${createdModel.name} model option`,
            );

            return ctx.sendMessage(`You selected ${createdModel.name} model`);
          }

          const updatedModel = await this.modelService.updateOne({
            name: modelName,
            chatId: chat.id,
          });

          return ctx.sendMessage(`You selected ${updatedModel.name} model`);
        }
        case SELECTION_TYPE.VOICE: {
          const voiceId = parsedCallbackData.data;
          const voice = await this.voiceService.findOneById(voiceId);

          if (!voice) {
            return ctx.sendMessage(`Selected voice does not exist`);
          }

          await this.chatService.updateOne(chat.id, {
            id: chat.id,
            voiceId,
          });

          this.logger.log(
            `Chat id: ${chat.id}, First name: ${existingChat.firstName} selected ${voice.name} as character prompt`,
          );
          return ctx.sendMessage(`You selected ${voice.name} voice profile`);
        }
        default:
          return ctx.sendMessage('Invalid selection');
      }
    } catch (err: any) {
      this.logger.error({ message: err.message, error: JSON.stringify(err) });
      return ctx.reply(
        `Failed handling callback option. Issue: ${err.message}`,
      );
    }
  }
}
