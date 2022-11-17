import * as Sentry from '@sentry/react';
import { SiweMessage } from 'siwe';
import { z } from 'zod';

import { getCircleApiKey } from '../../../api-lib/authHelpers';
import {
  zEthAddressOnly,
  zStringISODateUTC,
  zEthAddress,
  zUsername,
  zCircleName,
} from '../../forms/formHelpers';

const PERSONAL_SIGN_REGEX = /0x[0-9a-f]{130}/;

export const sha256HashString = z.string().length(64);

export const loginInput = z.object({
  address: zEthAddressOnly,
  data: z.string().refine(
    msg => {
      try {
        new SiweMessage(msg);
      } catch (e: unknown) {
        return false;
      }
      return true;
    },
    { message: 'Invalid message payload' }
  ),
  hash: z.string(),
  signature: z.string().regex(PERSONAL_SIGN_REGEX),
});

export const createCircleSchemaInput = z
  .object({
    user_name: zUsername,
    circle_name: zCircleName,
    image_data_base64: z.string().optional(),
    organization_id: z.number().int().positive().optional(),
    organization_name: z.string().min(3).max(255).optional(),
    contact: z.string().min(3).max(255).optional(),
  })
  .strict()
  .refine(
    data => data.organization_name || data.organization_id,
    'Either Protocol name should be filled in or a Protocol should be selected.'
  );

export const createContributionSchemaInput = z
  .object({
    circle_id: z.number(),
    description: z.string().min(3).max(1000),
    user_id: z.number().int().positive(),
  })
  .strict();

export const createOrganizationSchemaInput = z
  .object({
    name: z.string().min(3).max(255),
  })
  .strict();

export const adminUpdateUserSchemaInput = z
  .object({
    circle_id: z.number(),
    address: zEthAddressOnly,
    new_address: zEthAddressOnly.optional(),
    name: zUsername.optional(),
    starting_tokens: z.number().optional(),
    non_giver: z.boolean().optional(),
    fixed_non_receiver: z.boolean().optional(),
    non_receiver: z.boolean().optional(),
    role: z.number().min(0).max(1).optional(),
    fixed_payment_amount: z.number().min(0).max(100000000000).optional(),
  })
  .strict();

export const deleteUserInput = z
  .object({
    circle_id: z.number(),
    address: zEthAddressOnly,
  })
  .strict();

export const deleteCircleInput = z
  .object({
    circle_id: z.number(),
  })
  .strict();

export const deleteContributionInput = z
  .object({
    contribution_id: z.number().int().positive(),
  })
  .strict();

export const createNomineeInputSchema = z
  .object({
    name: zUsername,
    circle_id: z.number().int().positive(),
    address: zEthAddressOnly,
    description: z.string().min(3).max(1000),
  })
  .strict();

export const generateApiKeyInputSchema = z
  .object({
    name: z.string().min(3).max(255),
    circle_id: z.number().int().positive(),
    read_circle: z.boolean().optional(),
    update_circle: z.boolean().optional(),
    read_nominees: z.boolean().optional(),
    create_vouches: z.boolean().optional(),
    read_pending_token_gifts: z.boolean().optional(),
    update_pending_token_gifts: z.boolean().optional(),
    read_member_profiles: z.boolean().optional(),
    read_epochs: z.boolean().optional(),
    read_contributions: z.boolean().optional(),
    create_contributions: z.boolean().optional(),
    read_discord: z.boolean().optional(),
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
    name: zUsername,
    address: zEthAddress,
    non_giver: z.boolean().optional(),
    starting_tokens: z.number().optional().default(100),
    fixed_non_receiver: z.boolean().optional(),
    non_receiver: z.boolean().optional(),
    role: z.number().min(0).max(1).optional(),
    fixed_payment_amount: z.number().min(0).max(100000000000).optional(),
    entrance: z.string(),
  })
  .strict();

export const createUserFromTokenInput = z
  .object({
    token: z.string().uuid(),
    name: zUsername,
  })
  .strict();

export const createUsersBulkSchemaInput = z
  .object({
    circle_id: z.number(),
    users: createUserSchemaInput.omit({ circle_id: true }).array().min(1),
  })
  .strict();

export const circleIdInput = z
  .object({
    circle_id: z.number(),
  })
  .strip();

export const updateContributionInput = z
  .object({
    // this should probably be handled as a bigint
    id: z.number().int().positive(),
    description: z.string().nonempty(),
    datetime_created: zStringISODateUTC,
  })
  .strict();

export const uploadImageInput = z
  .object({ image_data_base64: z.string() })
  .strict();

export const uploadCircleImageInput = z
  .object({
    circle_id: z.number(),
    image_data_base64: z.string(),
  })
  .strict();

export const uploadOrgImageInput = z
  .object({
    org_id: z.number(),
    image_data_base64: z.string(),
  })
  .strict();

export const vouchInput = z
  .object({
    nominee_id: z.number(),
  })
  .strict();

export const vouchApiInput = z
  .object({
    nominee_id: z.number(),
    voucher_profile_id: z.number().int().positive().optional(),
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
    name: zCircleName.optional(),
    alloc_text: z.string().max(5000).optional(),
    auto_opt_out: z.boolean().optional(),
    default_opt_in: z.boolean().optional(),
    discord_webhook: z.string().url().optional().or(z.literal('')),
    min_vouches: z.number().min(1).optional(),
    nomination_days_limit: z.number().min(1).optional(),
    only_giver_vouch: z.boolean().optional(),
    team_sel_text: z.string().optional(),
    team_selection: z.boolean().optional(),
    token_name: z
      .string()
      .max(255)
      .refine(val => val.trim().length >= 3)
      .optional(),
    update_webhook: z.boolean().optional(),
    vouching: z.boolean().optional(),
    vouching_text: z.string().max(5000).optional(),
    fixed_payment_token_type: z
      .string()
      .max(200)
      .transform(s => (s === 'Disabled' ? null : s))
      .optional(),
    fixed_payment_vault_id: z.number().positive().nullable().optional(),
  })
  .strict();

export const restoreCoordinapeInput = z
  .object({
    circle_id: z.number(),
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

export const updateAllocationsApiInput = updateAllocationsInput.extend({
  user_id: z.number().int().positive().optional(),
});

export const allocationCsvInput = z
  .object({
    circle_id: z.number().int().positive(),
    grant: z.number().positive().min(1).max(1000000000).optional(),
    epoch: z.number().int().optional(),
    epoch_id: z.number().int().optional(),
    form_gift_amount: z.number().min(0).optional().default(0),
    gift_token_symbol: z.string().optional(),
  })
  .strict()
  .refine(
    data => data.epoch || data.epoch_id,
    'Either epoch or a epoch_id must be provided.'
  );

const IntIdString = z
  .string()
  .refine(
    s => Number.parseInt(s).toString() === s && Number.parseInt(s) > 0,
    'profileId not an integer'
  )
  .transform(val => Number.parseInt(val));

export const linkDiscordInputSchema = z
  .object({
    discord_id: z.string(),
  })
  .strict();

/*
  Hasura Auth Session Variables
*/

export const HasuraAdminSessionVariablesRaw = z.object({
  'x-hasura-role': z.literal('admin'),
});

export const HasuraAdminSessionVariables =
  HasuraAdminSessionVariablesRaw.transform(vars => ({
    hasuraRole: vars['x-hasura-role'],
  }));

export const HasuraApiSessionVariablesRaw = z.object({
  'x-hasura-api-key-hash': sha256HashString,
  'x-hasura-role': z.literal('api-user'),
  'x-hasura-circle-id': IntIdString,
});

const transformApiUserSession = async (
  vars: z.infer<typeof HasuraApiSessionVariablesRaw>
) => {
  const apiKeyHash = vars['x-hasura-api-key-hash'];
  Sentry.setTag('action_api_key_hash', apiKeyHash);
  const apiKey = await getCircleApiKey(apiKeyHash);
  return {
    hasuraRole: vars['x-hasura-role'],
    hasuraCircleId: vars['x-hasura-circle-id'],
    apiKey,
  };
};

export const HasuraUserSessionVariablesRaw = z.object({
  'x-hasura-user-id': IntIdString,
  'x-hasura-role': z.literal('user'),
  'x-hasura-address': zEthAddressOnly,
});

const transformUserSession = (
  vars: z.infer<typeof HasuraUserSessionVariablesRaw>
) => {
  Sentry.setTag('action_user_id', vars['x-hasura-user-id']);
  return {
    hasuraProfileId: vars['x-hasura-user-id'],
    hasuraRole: vars['x-hasura-role'],
    hasuraAddress: vars['x-hasura-address'],
  };
};
export const HasuraUserSessionVariables =
  HasuraUserSessionVariablesRaw.transform(transformUserSession);

export const HasuraUserAndApiSessionVariables = z
  .discriminatedUnion('x-hasura-role', [
    HasuraApiSessionVariablesRaw,
    HasuraUserSessionVariablesRaw,
    HasuraAdminSessionVariablesRaw,
  ])
  .transform(async vars => {
    if (vars['x-hasura-role'] === 'api-user') {
      return await transformApiUserSession(vars);
    }

    if (vars['x-hasura-role'] === 'user') {
      return transformUserSession(vars);
    }

    if (vars['x-hasura-role'] === 'admin') {
      return {
        hasuraRole: vars['x-hasura-role'],
      };
    }

    return { hasuraRole: null };
  });

type ApiKeyPermission =
  | 'create_vouches'
  | 'read_circle'
  | 'read_epochs'
  | 'read_member_profiles'
  | 'read_nominees'
  | 'read_pending_token_gifts'
  | 'update_circle'
  | 'update_pending_token_gifts';

export const getSessionVarsSchemaWithPermissions = (
  // Empty array = allow API access without checking specific permissions
  // 'block' = block API access
  permissions: ApiKeyPermission[] | 'block'
) => {
  return HasuraUserAndApiSessionVariables.refine(
    vars => {
      if (vars.hasuraRole === 'api-user') {
        if (permissions === 'block') return false;
        for (const p of permissions) {
          if (!vars.apiKey?.[p]) return false;
        }
      }

      return true;
    },
    permissions !== 'block'
      ? `Provided API key does not have the required permissions: ${permissions.join(
          ','
        )}`
      : `Unauthorized API Access`
  );
};

type SessionVariableSchema =
  | typeof HasuraAdminSessionVariables
  | typeof HasuraUserSessionVariables;

export type InputSchema<T extends z.ZodRawShape> =
  | z.ZodObject<T, 'strict' | 'strip'>
  | z.ZodEffects<z.ZodObject<T, 'strict' | 'strip'>>;

export function composeHasuraActionRequestBody<T extends z.ZodRawShape>(
  inputSchema: InputSchema<T>
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
  inputSchema: InputSchema<T>
) {
  return z.object({
    input: z.object({ payload: inputSchema }),
  });
}

export function composeHasuraActionRequestBodyWithSession<
  T extends z.ZodRawShape,
  V extends SessionVariableSchema
>(inputSchema: InputSchema<T>, sessionType: V) {
  return z.object({
    input: z.object({ payload: inputSchema }),
    action: z.object({ name: z.string() }),
    session_variables: sessionType,
    request_query: z.string().optional(),
  });
}

export function composeHasuraActionRequestBodyWithApiPermissions<
  T extends z.ZodRawShape
>(
  inputSchema: InputSchema<T>,
  // Empty array = allow API access without checking specific permissions
  // 'block' = block API access
  apiPermissions: ApiKeyPermission[] | 'block' = 'block'
) {
  return z.object({
    input: z.object({ payload: inputSchema }),
    action: z.object({ name: z.string() }),
    session_variables: getSessionVarsSchemaWithPermissions(apiPermissions),
    request_query: z.string().optional(),
  });
}
