import { Module } from '@nestjs/common';

import { TextCommand } from './text/text.command';
import { TextModule } from './text/text.module';

@Module({
  imports: [TextModule],
  providers: [TextCommand],
  exports: [TextCommand],
})
export class CmdModule {}
