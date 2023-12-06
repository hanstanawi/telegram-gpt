import { Test, type TestingModule } from '@nestjs/testing';
import { DatabaseService } from 'src/database/database.service';

import { MessageService } from './message.service';

const mockChats = [];

const mockChat = mockChats[0];

const mockDatabaseService = {
  message: {
    findMany: jest.fn().mockResolvedValue(mockChats),
    findUnique: jest.fn().mockResolvedValue(mockChat),
    findFirst: jest.fn().mockResolvedValue(mockChat),
    create: jest.fn().mockReturnValue(mockChat),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue(mockChat),
    delete: jest.fn().mockResolvedValue(mockChat),
  },
};

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
