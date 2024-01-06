import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from 'src/modules/character/character.service';
import { ChatService } from 'src/modules/chat/chat.service';
import { LlmService } from 'src/modules/llm/llm.service';
import { MessageService } from 'src/modules/message/message.service';
import { OpenAiAudioService } from 'src/modules/openai/services';
import { VoiceService } from 'src/modules/voice/voice.service';

import { AudioCommand } from './audio.command';

jest.mock('src/modules/openai/openai.lib', () => {
  return {
    __esModule: true,
    default: {
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    },
  };
});

const mockChatService = {
  findOneById: jest.fn(),
};

const mockCharacterService = {
  findOneById: jest.fn(),
};

const mockLlmService = {
  reply: jest.fn(),
};

const mockMessageService = {
  findAllByChatId: jest.fn(),
};

const mockVoiceService = {
  findOneById: jest.fn(),
};

const mockOpenAiAudioService = {
  synthesizeTextToSpeech: jest.fn(),
  transcribeAudioToText: jest.fn(),
};

describe('AudioCommand', () => {
  let command: AudioCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AudioCommand,
        { provide: ChatService, useValue: mockChatService },
        { provide: CharacterService, useValue: mockCharacterService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: VoiceService, useValue: mockVoiceService },
        { provide: OpenAiAudioService, useValue: mockOpenAiAudioService },
        { provide: LlmService, useValue: mockLlmService },
      ],
    }).compile();

    command = module.get<AudioCommand>(AudioCommand);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });
});
