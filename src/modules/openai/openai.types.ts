import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources';

export type OpenAIModel = OpenAI.Models.Model;
export type CompletionMessage = ChatCompletionMessageParam;
