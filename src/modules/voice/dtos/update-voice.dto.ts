import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateVoiceSchema = z.object({
  name: z.string().optional(),
});

export class UpdateVoiceDto extends createZodDto(updateVoiceSchema) {}
