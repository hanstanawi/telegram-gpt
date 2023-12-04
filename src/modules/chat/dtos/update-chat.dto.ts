import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateChatSchema = z.object({
  id: z.number().int(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  characterId: z.string().optional(),
});

export class UpdateChatDto extends createZodDto(updateChatSchema) {}
