import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateModelSchema = z.object({
  name: z.string().optional(),
  source: z.string().optional(),
  chatId: z.number().int(),
});

export class UpdateModelDto extends createZodDto(updateModelSchema) {}
