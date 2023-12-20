import { OpenAiChatService } from 'src/modules/openai/services';

/**
 * @description Language Model service to generate llm reply and prompt
 */
export class LLMService {
  constructor(private readonly openaiChatService: OpenAiChatService) {}

  public generatePrompt() {}

  public reply() {}
}
