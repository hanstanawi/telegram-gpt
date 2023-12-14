import { Test, TestingModule } from '@nestjs/testing';
import { VoiceService } from 'src/modules/voice/voice.service';

import { VoiceCommand } from './voice.command';

const mockVoiceService = {
  findAll: jest.fn(),
  findOneById: jest.fn(),
  insertOne: jest.fn(),
  updateOne: jest.fn(),
  removeOne: jest.fn(),
};

describe('VoiceCommand', () => {
  let command: VoiceCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoiceCommand,
        { provide: VoiceService, useValue: mockVoiceService },
      ],
    }).compile();

    command = module.get<VoiceCommand>(VoiceCommand);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });
});
