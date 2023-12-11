import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateCharacterSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
  prompt: z.string().optional(),
});

export class UpdateCharacterDto extends createZodDto(updateCharacterSchema) {}
