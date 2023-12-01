import { Module } from '@nestjs/common';
import { OpenAiModule } from 'src/modules/openai/openai.module';

import { ModelCommand } from './model.command';

@Module({
  imports: [OpenAiModule],
  providers: [ModelCommand],
  exports: [ModelCommand],
})
export class ModelModule {}
