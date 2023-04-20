import * as Sentry from '@sentry/react';
import { z } from 'zod';

import { zEthAddressOnly } from '../../src/lib/zod/formHelpers';
import { getCircleApiKey } from '../authHelpers';

/*
  Hasura Auth Session Variables
*/

const sha256HashString = z.string().length(64);

const IntIdString = z
  .string()
  .refine(
    s => Number.parseInt(s).toString() === s && Number.parseInt(s) > 0,
    'profileId not an integer'
  )
  .transform(val => Number.parseInt(val));

export const HasuraAdminSessionVariablesRaw = z.object({
  'x-hasura-role': z.literal('admin'),
});

export const HasuraAdminSessionVariables =
  HasuraAdminSessionVariablesRaw.transform(vars => ({
    hasuraRole: vars['x-hasura-role'],
    hasuraProfileId: undefined,
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
  | 'manage_users'
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

export type InputSchema<T extends z.ZodRawShape> =
  | z.ZodObject<T, 'strict' | 'strip'>
  | z.ZodEffects<z.ZodObject<T, 'strict' | 'strip'>>;

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
