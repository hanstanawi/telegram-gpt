import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from 'src/modules/character/character.service';
import { ChatService } from 'src/modules/chat/chat.service';
import { LlmService } from 'src/modules/llm/llm.service';
import { MessageService } from 'src/modules/message/message.service';

import { TextCommand } from './text.command';

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

describe('TextCommand', () => {
  let command: TextCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TextCommand,
        { provide: ChatService, useValue: mockChatService },
        { provide: CharacterService, useValue: mockCharacterService },
        { provide: LlmService, useValue: mockLlmService },
        { provide: MessageService, useValue: mockMessageService },
      ],
    }).compile();

    command = module.get<TextCommand>(TextCommand);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });
});
