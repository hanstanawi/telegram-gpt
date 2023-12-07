import { Test, type TestingModule } from '@nestjs/testing';
import { DatabaseService } from 'src/database/database.service';

import { ModelService } from './model.service';

const mockModel = {};

const mockDatabaseService = {
  model: {
    findMany: jest.fn().mockResolvedValue(mockModel),
    findUnique: jest.fn().mockResolvedValue(mockModel),
    findFirst: jest.fn().mockResolvedValue(mockModel),
    create: jest.fn().mockReturnValue(mockModel),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue(mockModel),
    delete: jest.fn().mockResolvedValue(mockModel),
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
