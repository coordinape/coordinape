import { z } from 'zod';

import {
  zEthAddressOnly,
  zStringISODateUTC,
} from '../../../src/forms/formHelpers';

const PERSONAL_SIGN_REGEX = /0x[0-9a-f]{130}/;
export const loginInput = z.object({
  address: zEthAddressOnly,
  data: z.string().refine(
    msg => {
      const templateOk = msg.startsWith('Login to Coordinape');
      const timestamp = msg.split(' ').pop();
      const timestampInPast =
        timestamp && Number.parseInt(timestamp) * 1000 < Date.now();

      const validLength = msg.length === 30;

      return templateOk && validLength && timestampInPast;
    },
    { message: 'Invalid message payload' }
  ),
  hash: z.string(),
  signature: z.string().regex(PERSONAL_SIGN_REGEX),
});

export const createCircleSchemaInput = z
  .object({
    user_name: z.string().min(3).max(255),
    circle_name: z.string().min(3).max(255),
    protocol_id: z.number().int().positive().optional(),
    protocol_name: z.string().min(3).max(255).optional(),
    contact: z.string().min(3).max(255).optional(),
  })
  .strict()
  .refine(
    data => data.protocol_name || data.protocol_id,
    'Either Protocol name should be filled in or a Protocol should be selected.'
  );

export const adminUpdateUserSchemaInput = z
  .object({
    circle_id: z.number(),
    address: zEthAddressOnly,
    new_address: zEthAddressOnly.optional(),
    name: z.string().min(3).max(255).optional(),
    starting_tokens: z.number().optional(),
    non_giver: z.boolean().optional(),
    fixed_non_receiver: z.boolean().optional(),
    non_receiver: z.boolean().optional(),
    role: z.number().min(0).max(1).optional(),
  })
  .strict();

export const deleteUserInput = z
  .object({
    circle_id: z.number(),
    address: zEthAddressOnly,
  })
  .strict();

export const createNomineeInputSchema = z
  .object({
    name: z.string().min(3).max(255),
    circle_id: z.number().int().positive(),
    address: zEthAddressOnly,
    description: z.string().min(3).max(1000),
  })
  .strict();

export const updateUserSchemaInput = z
  .object({
    circle_id: z.number(),
    non_receiver: z.boolean().optional(),
    epoch_first_visit: z.boolean().optional(),
    bio: z.string().optional(),
  })
  .strict();

export const createUserSchemaInput = z
  .object({
    circle_id: z.number(),
    name: z.string().min(3).max(255),
    address: zEthAddressOnly,
    non_giver: z.boolean().optional(),
    starting_tokens: z.number().optional().default(100),
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

export const vouchInput = z
  .object({
    nominee_id: z.number(),
  })
  .strict();

export const deleteEpochInput = z
  .object({
    id: z.number().int().positive(),
    circle_id: z.number().int().positive(),
  })
  .strict();

export const createEpochInput = z
  .object({
    circle_id: z.number().int().positive(),
    start_date: zStringISODateUTC,
    repeat: z.number().int().min(0).max(2),
    days: z
      .number()
      .min(1, 'Must be at least one day.')
      .max(100, 'cant be more than 100 days'),
    grant: z.number().positive().min(1).max(1000000000).optional(),
  })
  .strict()
  .superRefine((val, ctx) => {
    let message;
    if (val.days > 7 && val.repeat === 1) {
      message =
        'You cannot have more than 7 days length for a weekly repeating epoch.';
    } else if (val.days > 28 && val.repeat === 2) {
      message =
        'You cannot have more than 28 days length for a monthly repeating epoch.';
    }

    if (message) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
      });
    }
  });

export const updateEpochInput = z
  .object({
    id: z.number().int().positive(),
    circle_id: z.number().int().positive(),
    start_date: zStringISODateUTC,
    repeat: z.number().int().min(0).max(2),
    days: z
      .number()
      .min(1, 'Must be at least one day.')
      .max(100, 'cant be more than 100 days'),
    grant: z.number().positive().min(1).max(1000000000).optional(),
  })
  .strict()
  .superRefine((val, ctx) => {
    let message;
    if (val.days > 7 && val.repeat === 1) {
      message =
        'You cannot have more than 7 days length for a weekly repeating epoch.';
    } else if (val.days > 28 && val.repeat === 2) {
      message =
        'You cannot have more than 28 days length for a monthly repeating epoch.';
    }

    if (message) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
      });
    }
  });

export const updateTeammatesInput = z
  .object({
    teammates: z.number().int().positive().array(),
    circle_id: z.number().int().positive(),
  })
  .strict();

export const updateCircleInput = z

  .object({
    circle_id: z.number().positive(),
    name: z.string().min(3).max(255).optional(),
    alloc_text: z.string().max(5000).optional(),
    auto_opt_out: z.boolean().optional(),
    default_opt_in: z.boolean().optional(),
    discord_webhook: z.string().url().optional().or(z.literal('')),
    min_vouches: z.number().min(1).optional(),
    nomination_days_limit: z.number().min(1).optional(),
    only_giver_vouch: z.boolean().optional(),
    team_sel_text: z.string().optional(),
    team_selection: z.boolean().optional(),
    token_name: z.string().max(255).optional(),
    update_webhook: z.boolean().optional(),
    vouching: z.boolean().optional(),
    vouching_text: z.string().max(5000).optional(),
  })
  .strict();

export const updateAllocationsInput = z.object({
  allocations: z
    .object({
      recipient_id: z.number().int().positive(),
      tokens: z.number().int().min(0),
      note: z.string().max(5000).optional(),
    })
    .array(),
  circle_id: z.number().int().positive(),
});

export const allocationCsvInput = z
  .object({
    circle_id: z.number().int().positive(),
    grant: z.number().positive().min(1).max(1000000000).optional(),
    epoch: z.number().int().optional(),
    epoch_id: z.number().int().optional(),
  })
  .strict()
  .refine(
    data => data.epoch || data.epoch_id,
    'Either epoch or a epoch_id must be provided.'
  );

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
    input: z.object({ payload: inputSchema }),
    action: z.object({ name: z.string() }),
    session_variables: z.union([
      HasuraAdminSessionVariables,
      HasuraUserSessionVariables,
    ]),
    request_query: z.string().optional(),
  });
}

export function composeCrossClientAuthRequestBody<T extends z.ZodRawShape>(
  inputSchema:
    | z.ZodObject<T, 'strict' | 'strip'>
    | z.ZodEffects<z.ZodObject<T, 'strict' | 'strip'>>
) {
  return z.object({
    input: z.object({ payload: inputSchema }),
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
    input: z.object({ payload: inputSchema }),
    action: z.object({ name: z.string() }),
    session_variables: sessionType,
    request_query: z.string().optional(),
  });
}
