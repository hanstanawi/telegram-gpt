import { Test, TestingModule } from '@nestjs/testing';

import { VoiceCommand } from './voice.command';

describe('ResetCommand', () => {
  let command: VoiceCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoiceCommand],
    }).compile();

    command = module.get<VoiceCommand>(VoiceCommand);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });
});
