import { Test, type TestingModule } from '@nestjs/testing';
import { DatabaseService } from 'src/database/database.service';

import { MessageService } from './message.service';

const mockMessages = [];

const mockMessage = mockMessages[0];

const mockDatabaseService = {
  message: {
    findMany: jest.fn().mockResolvedValue(mockMessages),
    findUnique: jest.fn().mockResolvedValue(mockMessage),
    findFirst: jest.fn().mockResolvedValue(mockMessage),
    create: jest.fn().mockReturnValue(mockMessage),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue(mockMessage),
    delete: jest.fn().mockResolvedValue(mockMessage),
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
