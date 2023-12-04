import { Test, TestingModule } from '@nestjs/testing';

import { StartCommand } from './start.command';

describe('StartCommand', () => {
  let command: StartCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StartCommand],
    }).compile();

    command = module.get<StartCommand>(StartCommand);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });
});
