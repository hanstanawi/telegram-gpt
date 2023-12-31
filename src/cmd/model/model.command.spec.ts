import { Test, TestingModule } from '@nestjs/testing';
import { OpenAiModelService } from 'src/modules/openai/services';

import { ModelCommand } from './model.command';

jest.mock('src/modules/openai/openai.lib', () => {
  return {
    __esModule: true,
    default: {
      models: {
        list: jest.fn(),
      },
    },
  };
});

describe('ModelCommand', () => {
  let command: ModelCommand;

  const mockOpenAiModelService = {
    getAllModels: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModelCommand,
        { provide: OpenAiModelService, useValue: mockOpenAiModelService },
      ],
    }).compile();

    command = module.get<ModelCommand>(ModelCommand);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });
});
