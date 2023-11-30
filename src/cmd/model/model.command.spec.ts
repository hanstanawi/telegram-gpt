import { Test, TestingModule } from '@nestjs/testing';
import { OpenAiService } from 'src/modules/openai/services';

import { ModelCommand } from './model.command';

describe('ModelCommand', () => {
  let command: ModelCommand;

  const mockOpenAiService = {
    getAllModels: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModelCommand,
        { provide: OpenAiService, useValue: mockOpenAiService },
      ],
    }).compile();

    command = module.get<ModelCommand>(ModelCommand);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });
});
