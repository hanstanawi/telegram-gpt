import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from 'src/modules/character/character.service';
import { ChatService } from 'src/modules/chat/services';
import { ModelService } from 'src/modules/model/model.service';
import { VoiceService } from 'src/modules/voice/voice.service';

import { CallbackCommand } from './callback.command';

const mockChatService = {
  findOne: jest.fn(),
  updateOne: jest.fn(),
};

const mockCharacterService = {
  findOneById: jest.fn(),
};

const mockModelService = {
  findOneByChatId: jest.fn(),
  insertOne: jest.fn(),
  updateOne: jest.fn(),
};

const mockVoiceService = {
  findOneById: jest.fn(),
};

describe('Callback Query command', () => {
  let command: CallbackCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CallbackCommand,
        { provide: ChatService, useValue: mockChatService },
        { provide: CharacterService, useValue: mockCharacterService },
        { provide: ModelService, useValue: mockModelService },
        { provide: VoiceService, useValue: mockVoiceService },
      ],
    }).compile();

    command = module.get<CallbackCommand>(CallbackCommand);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });
});
