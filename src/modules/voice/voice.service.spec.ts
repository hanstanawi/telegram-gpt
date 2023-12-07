import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from 'src/database/database.service';

import { VoiceService } from './voice.service';

const mockVoice = {
  id: '',
  name: 'claude',
  chatId: 1234,
};

const mockDatabaseService = {
  voice: {
    findUnique: jest.fn().mockResolvedValue(mockVoice),
    findFirst: jest.fn().mockResolvedValue(mockVoice),
    create: jest.fn().mockReturnValue(mockVoice),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue(mockVoice),
    delete: jest.fn().mockResolvedValue(mockVoice),
  },
};

describe('VoiceService', () => {
  let service: VoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoiceService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<VoiceService>(VoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
