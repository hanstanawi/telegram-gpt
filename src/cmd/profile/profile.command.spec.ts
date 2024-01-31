import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from 'src/modules/chat/chat.service';
import { MessageService } from 'src/modules/message/message.service';
import { ModelService } from 'src/modules/model/model.service';
import { VoiceService } from 'src/modules/voice/voice.service';

import { ProfileCommand } from './profile.command';

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

const mockVoiceService = {
  findOneByChatId: jest.fn(),
  insertOne: jest.fn(),
  updateOne: jest.fn(),
  removeOne: jest.fn(),
};

describe('ProfileCommand', () => {
  let command: ProfileCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileCommand,
        { provide: ChatService, useValue: mockChatService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ModelService, useValue: mockModelService },
        { provide: VoiceService, useValue: mockVoiceService },
      ],
    }).compile();

    command = module.get<ProfileCommand>(ProfileCommand);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });
});
