import { Module } from '@nestjs/common';

import { ModelService } from './model.service';

@Module({
  providers: [ModelService],
  exports: [ModelService],
})
export class ModelModule {}
