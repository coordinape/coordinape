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

// this shape mirrors the shape of the original rest endpoint
// it might be preferable to fold circle_id into the object
export const createUserSchemaInput = z.object({
  circle_id: z.number(),
  object: z.object({
    name: z.string().min(3).max(255),
    address: zEthAddressOnly,
    non_giver: z.boolean().optional(),
    starting_tokens: z.number().optional(),
    give_token_remaining: z.number().optional(),
    fixed_non_receiver: z.boolean().optional(),
    non_receiver: z.boolean().optional(),
    role: z.number().min(0).max(1).optional(),
  }),
});
