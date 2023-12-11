import { Module } from '@nestjs/common';

import { ModelCommand } from './model.command';

@Module({
  providers: [ModelCommand],
  exports: [ModelCommand],
})
export class ModelCmdModule {}
