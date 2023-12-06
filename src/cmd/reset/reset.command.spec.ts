import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from 'src/modules/chat/chat.service';
import { MessageService } from 'src/modules/message/message.service';
import { ModelService } from 'src/modules/model/model.service';

import { ResetCommand } from './reset.command';

const mockChatService = {
  findAll: jest.fn(),
  findOneById: jest.fn(),
  insertOne: jest.fn(),
  updateOne: jest.fn(),
};

const mockMessageService = {
  findAllByChatId: jest.fn(),
  findOneById: jest.fn(),
  insertOne: jest.fn(),
  removeAll: jest.fn(),
};

const mockModelService = {
  findOneByChatId: jest.fn(),
  insertOne: jest.fn(),
  updateOne: jest.fn(),
  removeOne: jest.fn(),
};

describe('ResetCommand', () => {
  let command: ResetCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResetCommand,
        { provide: ChatService, useValue: mockChatService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ModelService, useValue: mockModelService },
      ],
    }).compile();

    command = module.get<ResetCommand>(ResetCommand);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });
});
