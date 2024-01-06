import type { CallbackQuery, Message, User } from '@telegraf/types';

export type TelegramMessage = Message.ServiceMessage;
export type TelegramUser = User;
export type TelegramTextMessage = Message.TextMessage;
export type TelegramVoiceMessage = Message.VoiceMessage;
export type CallbackDataQuery = CallbackQuery.DataQuery;
