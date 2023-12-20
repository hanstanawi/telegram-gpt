import { Test, TestingModule } from '@nestjs/testing';

import { ChatService } from './chat.service';
import { LLMService } from './llm.service';

const mockChatService = {
  findOneById: jest.fn(),
};

describe('LLMService', () => {
  let service: LLMService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LLMService,
        { provide: ChatService, useValue: mockChatService },
      ],
    }).compile();

    service = module.get<LLMService>(LLMService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
