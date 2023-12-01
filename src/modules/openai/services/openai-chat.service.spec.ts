import { Test, TestingModule } from '@nestjs/testing';

import { OpenAiChatService } from './openai-chat.service';

jest.mock('../openai.lib', () => {
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

describe('OpenAiChatService', () => {
  let service: OpenAiChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenAiChatService],
    }).compile();

    service = module.get<OpenAiChatService>(OpenAiChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
