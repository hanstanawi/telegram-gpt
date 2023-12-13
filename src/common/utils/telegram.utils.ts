import type { InlineKeyboardButton } from '@telegraf/types';

import type { CallbackData, SelectionType } from '../types';

type RequiredInlineKeyboardRecord = {
  id: string;
  name?: string;
};

type InlineKeyboardList<T> = {
  [K in keyof T]: T[K];
} & RequiredInlineKeyboardRecord;

export function transformListToKeyboardButtons<T extends InlineKeyboardList<T>>(
  list: T[],
  type: SelectionType,
): InlineKeyboardButton[] {
  return list.map((item) => {
    const callbackData: CallbackData<string> = {
      data: item.id,
      type,
    };

    return {
      text: item.name ?? item.id, // in openai models, id acts as model name
      callback_data: JSON.stringify(callbackData),
    };
  });
}
