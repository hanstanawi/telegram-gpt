import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createChatSchema = z.object({
  id: z.number().int(),
  firstName: z.string().min(1),
  lastName: z.string().optional(),
});

export class CreateChatDto extends createZodDto(createChatSchema) {}
