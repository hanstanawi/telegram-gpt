import OpenAI from 'openai';
import type {
  Audio,
  ChatCompletion,
  ChatCompletionMessageParam,
} from 'openai/resources';

export type OpenAIModel = OpenAI.Models.Model;
export type CompletionMessage = ChatCompletionMessageParam;
export type ChatCompletionResult = ChatCompletion;
export type OpenAIAudio = Audio;
export type VoiceOption =
  | 'alloy'
  | 'echo'
  | 'fable'
  | 'onyx'
  | 'nova'
  | 'shimmer';
