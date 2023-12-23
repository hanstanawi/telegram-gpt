import { Test, TestingModule } from '@nestjs/testing';

import { ChatService } from '../chat/chat.service';
import { LlmService } from './llm.service';

const mockChatService = {
  findOneById: jest.fn(),
};

describe('LlmService', () => {
  let service: LlmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LlmService,
        { provide: ChatService, useValue: mockChatService },
      ],
    }).compile();

    service = module.get<LlmService>(LlmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
