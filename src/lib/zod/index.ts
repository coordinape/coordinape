import { z } from 'zod';

import { zEthAddressOnly } from '../../../src/forms/formHelpers';

export const createCircleSchemaInput = z
  .object({
    user_name: z.string().min(3).max(255),
    address: zEthAddressOnly,
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
