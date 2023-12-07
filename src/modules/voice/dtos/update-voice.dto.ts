import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateVoiceSchema = z.object({
  name: z.string().optional(),
  chatId: z.number().int(),
});

export class UpdateVoiceDto extends createZodDto(updateVoiceSchema) {}
