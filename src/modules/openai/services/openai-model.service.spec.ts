import { Test, TestingModule } from '@nestjs/testing';

import { OpenAiModelService } from './openai-model.service';

describe('OpenAiService', () => {
  let service: OpenAiModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenAiModelService],
    }).compile();

    service = module.get<OpenAiModelService>(OpenAiModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
