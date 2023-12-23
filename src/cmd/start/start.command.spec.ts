import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from 'src/modules/chat/chat.service';

import { StartCommand } from './start.command';

const mockChatService = {
  findAll: jest.fn(),
  findOneById: jest.fn(),
  insertOne: jest.fn(),
  updateOne: jest.fn(),
};

describe('StartCommand', () => {
  let command: StartCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StartCommand,
        { provide: ChatService, useValue: mockChatService },
      ],
    }).compile();

    command = module.get<StartCommand>(StartCommand);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });
});
