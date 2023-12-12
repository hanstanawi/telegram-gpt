import { Character } from '@prisma/client';
import { InlineKeyboardButton } from '@telegraf/types';
import { SELECTION_TYPE } from 'src/common/constants';
import { CallbackData } from 'src/common/types';

export function transformCharactersToKeyboardButtons(
  characters: Character[],
): InlineKeyboardButton[] {
  return characters.map((character) => {
    const callbackData: CallbackData<string> = {
      data: character.id,
      type: SELECTION_TYPE.CHARACTER,
    };

    return {
      text: character.name,
      callback_data: JSON.stringify(callbackData),
    };
  });
}
