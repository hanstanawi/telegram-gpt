import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createVoiceSchema = z.object({
  name: z.string(),
});

export class CreateVoiceDto extends createZodDto(createVoiceSchema) {}
