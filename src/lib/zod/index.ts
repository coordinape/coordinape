import { z } from 'zod';

import { zEthAddressOnly } from '../../../src/forms/formHelpers';

export const createCircleSchemaInput = z
  .object({
    user_name: z.string().min(3).max(255),
    circle_name: z.string().min(3).max(255),
    protocol_id: z.number().int().positive().optional(),
    protocol_name: z.string().min(3).max(255).optional(),
  })
  .strict()
  .refine(
    data =>
      (data.protocol_name || data.protocol_id) &&
      !(data.protocol_name && data.protocol_id),
    'Either Protocol name should be filled in or a Protocol should be selected.'
  );

// this shape mirrors the shape of the original rest endpoint
// it might be preferable to fold circle_id into the object
export const createUserSchemaInput = z
  .object({
    circle_id: z.number(),
    name: z.string().min(3).max(255),
    address: zEthAddressOnly,
    non_giver: z.boolean().optional(),
    starting_tokens: z.number().optional(),
    give_token_remaining: z.number().optional(),
    fixed_non_receiver: z.boolean().optional(),
    non_receiver: z.boolean().optional(),
    role: z.number().min(0).max(1).optional(),
  })
  .strict();

export const circleIdInput = z
  .object({
    circle_id: z.number(),
  })
  .strip();

export const uploadImageInput = z
  .object({ image_data_base64: z.string() })
  .strict();

export const uploadCircleImageInput = z
  .object({
    circle_id: z.number(),
    image_data_base64: z.string(),
  })
  .strict();

export const HasuraAdminSessionVariables = z
  .object({
    'x-hasura-role': z.literal('admin'),
  })
  .transform(vars => ({
    hasuraRole: vars['x-hasura-role'],
  }));

export const HasuraUserSessionVariables = z
  .object({
    'x-hasura-user-id': z
      .string()
      .refine(
        s => Number.parseInt(s).toString() === s && Number.parseInt(s) > 0,
        'profileId not an integer'
      )
      .transform(Number.parseInt),
    'x-hasura-role': z.union([z.literal('user'), z.literal('superadmin')]),
    'x-hasura-address': zEthAddressOnly,
  })
  .transform(vars => ({
    hasuraProfileId: vars['x-hasura-user-id'],
    hasuraRole: vars['x-hasura-role'],
    hasuraAddress: vars['x-hasura-address'],
  }));

type SessionVariableSchema =
  | typeof HasuraAdminSessionVariables
  | typeof HasuraUserSessionVariables;

export function composeHasuraActionRequestBody<T extends z.ZodRawShape>(
  inputSchema:
    | z.ZodObject<T, 'strict' | 'strip'>
    | z.ZodEffects<z.ZodObject<T, 'strict' | 'strip'>>
) {
  return z.object({
    // for some reason, it's unsafe to transform the generic input
    // to strip away the outer object
    input: z.object({ object: inputSchema }),
    action: z.object({ name: z.string() }),
    session_variables: z.union([
      HasuraAdminSessionVariables,
      HasuraUserSessionVariables,
    ]),
    request_query: z.string(),
  });
}

export function composeHasuraActionRequestBodyWithSession<
  T extends z.ZodRawShape,
  V extends SessionVariableSchema
>(
  inputSchema:
    | z.ZodObject<T, 'strict' | 'strip'>
    | z.ZodEffects<z.ZodObject<T, 'strict' | 'strip'>>,
  sessionType: V
) {
  return z.object({
    input: z.object({ object: inputSchema }),
    action: z.object({ name: z.string() }),
    session_variables: sessionType,
    request_query: z.string(),
  });
}
