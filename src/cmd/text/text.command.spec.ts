import { Test, TestingModule } from '@nestjs/testing';

import { TextCommand } from './text.command';

describe('TextCommand', () => {
  let command: TextCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TextCommand],
    }).compile();

    command = module.get<TextCommand>(TextCommand);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });
});
