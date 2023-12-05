import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createMessageSchema = z.object({
  text: z.string(),
  role: z.string(),
  chatId: z.number(),
});

export class CreateMessageDto extends createZodDto(createMessageSchema) {}
