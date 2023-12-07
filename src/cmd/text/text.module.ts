import { Module } from '@nestjs/common';

import { TextCommand } from './text.command';

@Module({
  providers: [TextCommand],
  exports: [TextCommand],
})
export class TextCmdModule {}
