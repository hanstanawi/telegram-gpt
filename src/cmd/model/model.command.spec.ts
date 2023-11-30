import { Test, TestingModule } from '@nestjs/testing';

import { ModelCommand } from './model.command';

describe('ModelCommand', () => {
  let command: ModelCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelCommand],
    }).compile();

    command = module.get<ModelCommand>(ModelCommand);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });
});
