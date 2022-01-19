import { z } from 'zod';

export const createCircleSchemaInput = z
  .object({
    user_name: z.string().min(3).max(255),
    address: z.string().regex(/^(0x)?[0-9a-f]{40}$/i),
    circle_name: z.string().min(3).max(255),
    protocol_id: z.number().int().positive().optional(),
    protocol_name: z.string().min(3).max(255).optional(),
  })
  .refine(
    data =>
      (data.protocol_name || data.protocol_id) &&
      !(data.protocol_name && data.protocol_id),
    'Either Protocol name should be filled in or a Protocol should be selected.'
  );
