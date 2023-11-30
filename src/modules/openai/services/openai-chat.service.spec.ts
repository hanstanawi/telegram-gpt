import { Test, TestingModule } from '@nestjs/testing';

import { OpenAiService } from './openai.service';
import { OpenAiChatService } from './openai-chat.service';

describe('OpenAiChatService', () => {
  let service: OpenAiChatService;

  const mockOpenAiService = {
    openAiInstance: {},
    getAllModels: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenAiChatService,
        { provide: OpenAiService, useValue: mockOpenAiService },
      ],
    }).compile();

    service = module.get<OpenAiChatService>(OpenAiChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
