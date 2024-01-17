import { Module } from '@nestjs/common';

import { ProfileCommand } from './profile.command';

@Module({
  providers: [ProfileCommand],
  exports: [ProfileCommand],
})
export class ProfileModule {}
