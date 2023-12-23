import { type Message } from '@prisma/client';
import { z } from 'zod';

export const createChatCompletionMessagesSchema = z.object({
  characterPrompt: z.string().min(1),
  messages: z.array(z.custom<Message>()),
  text: z.string().min(1),
  chatId: z.number(),
});

export type ChatCompletionMessagesPayload = z.infer<
  typeof createChatCompletionMessagesSchema
>;
