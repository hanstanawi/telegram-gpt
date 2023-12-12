import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from 'src/core/cache/cache.service';

import { OpenAiModelService } from './openai-model.service';

jest.mock('../openai.lib', () => {
  return {
    __esModule: true,
    default: {
      models: {
        list: jest.fn(),
      },
    },
  };
});

const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
};

describe('OpenAiService', () => {
  let service: OpenAiModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenAiModelService,
        { provide: CacheService, useValue: mockCacheService },
      ],
    }).compile();

    service = module.get<OpenAiModelService>(OpenAiModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
