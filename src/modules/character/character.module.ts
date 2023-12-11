import { Module } from '@nestjs/common';

import { CharacterService } from './character.service';

@Module({
  providers: [CharacterService],
  exports: [CharacterService],
})
export class CharacterModule {}
