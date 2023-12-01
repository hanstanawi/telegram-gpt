import { Test, TestingModule } from '@nestjs/testing';

import { OpenAiAudioService } from './openai-audio.service';

jest.mock('../openai.lib', () => {
  return {
    __esModule: true,
    default: {
      audio: {
        transcription: {
          create: jest.fn(),
        },
        speech: {
          create: jest.fn(),
        },
      },
    },
  };
});

describe('OpenAiService', () => {
  let service: OpenAiAudioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenAiAudioService],
    }).compile();

    service = module.get<OpenAiAudioService>(OpenAiAudioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
