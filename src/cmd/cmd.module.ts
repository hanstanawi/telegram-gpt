import { Module } from '@nestjs/common';
import { OpenAiModule } from 'src/modules/openai/openai.module';

import { ModelCommand } from './model/model.command';
import { TextCommand } from './text/text.command';

@Module({
  imports: [OpenAiModule],
  providers: [TextCommand, ModelCommand],
  exports: [TextCommand, ModelCommand],
})
export class CmdModule {}
