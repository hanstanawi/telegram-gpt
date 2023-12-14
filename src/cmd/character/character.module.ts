import { Module } from '@nestjs/common';
import { CharacterService } from 'src/modules/character/character.service';

@Module({
  providers: [CharacterService],
  exports: [CharacterService],
})
export class CharacterCmdModule {}
