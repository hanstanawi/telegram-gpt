import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from 'src/modules/character/character.service';

import { CharacterCommand } from './character.command';

const mockCharacterService = {
  findAll: jest.fn(),
  findOneById: jest.fn(),
  insertOne: jest.fn(),
  updateOne: jest.fn(),
  removeOne: jest.fn(),
};

describe('ResetCommand', () => {
  let command: CharacterCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharacterCommand,
        { provide: CharacterService, useValue: mockCharacterService },
      ],
    }).compile();

    command = module.get<CharacterCommand>(CharacterCommand);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });
});
