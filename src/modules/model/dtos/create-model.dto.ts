import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createModelSchema = z.object({
  name: z.string().min(1),
  source: z.string().min(1),
  chatId: z.number().int(),
});

export class CreateModelDto extends createZodDto(createModelSchema) {}
