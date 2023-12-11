import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from 'src/database/database.service';

import { CharacterService } from './character.service';

const mockCharacters = [];

const mockCharacter = mockCharacters[0];

const mockDatabaseService = {
  chat: {
    findMany: jest.fn().mockResolvedValue(mockCharacters),
    findUnique: jest.fn().mockResolvedValue(mockCharacter),
    findFirst: jest.fn().mockResolvedValue(mockCharacter),
    create: jest.fn().mockReturnValue(mockCharacter),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue(mockCharacter),
    delete: jest.fn().mockResolvedValue(mockCharacter),
  },
};

describe('CharacterService', () => {
  let service: CharacterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharacterService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<CharacterService>(CharacterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
