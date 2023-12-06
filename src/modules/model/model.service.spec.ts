import { Test, type TestingModule } from '@nestjs/testing';
import { DatabaseService } from 'src/database/database.service';

import { ModelService } from './model.service';

const mockChats = [];

const mockChat = mockChats[0];

const mockDatabaseService = {
  model: {
    findMany: jest.fn().mockResolvedValue(mockChats),
    findUnique: jest.fn().mockResolvedValue(mockChat),
    findFirst: jest.fn().mockResolvedValue(mockChat),
    create: jest.fn().mockReturnValue(mockChat),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue(mockChat),
    delete: jest.fn().mockResolvedValue(mockChat),
  },
};

describe('ModelService', () => {
  let service: ModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModelService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<ModelService>(ModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
