import { Module } from '@nestjs/common';

import { CallbackCommand } from './callback.command';

@Module({
  providers: [CallbackCommand],
  exports: [CallbackCommand],
})
export class CallbackModule {}
