import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { createMessageSchema } from './create-message.dto';

export const createMessagesSchema = z.array(createMessageSchema);

export class CreateMessagesDto extends createZodDto(createMessagesSchema) {}
