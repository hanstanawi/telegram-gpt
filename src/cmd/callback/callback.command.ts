import { Injectable } from '@nestjs/common';
import type { CallbackDataQuery } from 'src/common/types';
import { Context } from 'telegraf';

@Injectable()
export class CallbackCommand {
  constructor() {}

  public async handleCallbackQuery(ctx: Context) {
    if (!ctx.has('callback_query')) {
      return 'Invalid callback query command';
    }

    const callbackQuery = ctx.update.callback_query as CallbackDataQuery;

    if (!callbackQuery.message) {
      return;
    }

    if (!callbackQuery.from) {
      return;
    }

    const callbackData = callbackQuery.data;

    return 'callback';
  }
}
