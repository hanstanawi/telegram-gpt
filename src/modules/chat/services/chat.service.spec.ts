import { Test, type TestingModule } from '@nestjs/testing';
import { DatabaseService } from 'src/database/database.service';

import { ChatService } from './chat.service';

const mockChats = [];

const mockChat = mockChats[0];

const mockDatabaseService = {
  chat: {
    findMany: jest.fn().mockResolvedValue(mockChats),
    findUnique: jest.fn().mockResolvedValue(mockChat),
    findFirst: jest.fn().mockResolvedValue(mockChat),
    create: jest.fn().mockReturnValue(mockChat),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue(mockChat),
    delete: jest.fn().mockResolvedValue(mockChat),
  },
};

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
