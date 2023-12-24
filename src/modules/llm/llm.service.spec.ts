import { Test, TestingModule } from '@nestjs/testing';

import { MessageService } from '../message/message.service';
import { ModelService } from '../model/model.service';
import { OpenAiChatService } from '../openai/services';
import { LlmService } from './llm.service';

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

const mockOpenAiChatService = {
  generateChatCompletion: jest.fn(),
};

const mockModelService = {
  findOneByChatId: jest.fn(),
};

const mockMessageService = {
  removeAll: jest.fn(),
};

describe('LlmService', () => {
  let service: LlmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LlmService,
        { provide: OpenAiChatService, useValue: mockOpenAiChatService },
        { provide: ModelService, useValue: mockModelService },
        { provide: MessageService, useValue: mockMessageService },
      ],
    }).compile();

    service = module.get<LlmService>(LlmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
