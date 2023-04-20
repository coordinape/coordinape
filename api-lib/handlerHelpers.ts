import assert from 'assert';

import { VercelRequest } from '@vercel/node';
import { z } from 'zod';

import {
  InputSchema,
  HasuraUserSessionVariables,
  getSessionVarsSchemaWithPermissions,
  HasuraUserOrAdminSessionVariables,
} from './requests/schema';
import type { ApiKeyPermission } from './requests/schema';

type ApiPermissions = ApiKeyPermission[] | 'block';

async function getUserSessionInput<T extends z.ZodRawShape>(
  req: VercelRequest,
  schema: InputSchema<T>
) {
  const fullSchema = z.object({
    action: z.object({ name: z.string() }),
    input: z.object({ payload: schema }),
    session_variables: HasuraUserSessionVariables,
    request_query: z.string().optional(),
  });

  // this will throw if the input isn't valid
  const { action, session_variables, input } = await fullSchema.parseAsync(
    req.body
  );
  assert(input?.payload, 'input.payload is missing after parsing');

  return { action, session: session_variables, payload: input.payload };
}

// FIXME there's probably a better way to get typing to work than
// almost-duplicating the method above
async function getUserOrAdminSessionInput<T extends z.ZodRawShape>(
  req: VercelRequest,
  schema: InputSchema<T>
) {
  const fullSchema = z.object({
    action: z.object({ name: z.string() }),
    input: z.object({ payload: schema }),
    session_variables: HasuraUserOrAdminSessionVariables,
    request_query: z.string().optional(),
  });

  // this will throw if the input isn't valid
  const { action, session_variables, input } = await fullSchema.parseAsync(
    req.body
  );
  assert(input?.payload, 'input.payload is missing after parsing');

  return { action, session: session_variables, payload: input.payload };
}

async function getUserSessionNoInput(req: VercelRequest) {
  const fullSchema = z.object({
    action: z.object({ name: z.string() }),
    session_variables: HasuraUserSessionVariables,
    request_query: z.string().optional(),
  });
  // this will throw if the input isn't valid
  const { action, session_variables } = await fullSchema.parseAsync(req.body);
  return { action, session: session_variables };
}

async function getUserOrApiSessionInput<T extends z.ZodRawShape>(
  req: VercelRequest,
  schema: InputSchema<T>,
  apiPermissions: ApiPermissions
) {
  const fullSchema = z.object({
    input: z.object({ payload: schema }),
    action: z.object({ name: z.string() }),
    session_variables: getSessionVarsSchemaWithPermissions(apiPermissions),
    request_query: z.string().optional(),
  });

  // this will throw if the api user doesn't have the right permissions
  const { action, session_variables, input } = await fullSchema.parseAsync(
    req.body
  );
  assert(input?.payload, 'input.payload is missing after parsing');

  return { action, session: session_variables, payload: input.payload };
}

// this is a hack for getting ReturnType to work with generics
// https://stackoverflow.com/questions/50321419/typescript-returntype-of-generic-function?noredirect=1&lq=1
class Wrapper<T extends z.ZodRawShape> {
  wrapped1(req: VercelRequest, schema: InputSchema<T>) {
    return getUserSessionInput<T>(req, schema);
  }

  wrapped2(
    req: VercelRequest,
    schema: InputSchema<T>,
    apiPermissions: ApiPermissions
  ) {
    return getUserOrApiSessionInput<T>(req, schema, apiPermissions);
  }

  wrapped3(req: VercelRequest, schema: InputSchema<T>) {
    return getUserOrAdminSessionInput<T>(req, schema);
  }
}

export async function getInput(
  req: VercelRequest
): ReturnType<typeof getUserSessionNoInput>;

export async function getInput<T extends z.ZodRawShape>(
  req: VercelRequest,
  schema: InputSchema<T>
): ReturnType<Wrapper<T>['wrapped1']>;

export async function getInput<T extends z.ZodRawShape>(
  req: VercelRequest,
  schema: InputSchema<T>,
  options: { apiPermissions: ApiPermissions }
): ReturnType<Wrapper<T>['wrapped2']>;

export async function getInput<T extends z.ZodRawShape>(
  req: VercelRequest,
  schema: InputSchema<T>,
  options: { allowAdmin: true }
): ReturnType<Wrapper<T>['wrapped3']>;

export async function getInput<T extends z.ZodRawShape>(
  req: VercelRequest,
  schema?: InputSchema<T>,

  // Undefined: no API access
  // Empty array: allow API access without checking specific permissions
  // 'block': block API access
  options?: { apiPermissions?: ApiPermissions; allowAdmin?: boolean }
) {
  if (!schema) return getUserSessionNoInput(req);

  // when apiPermissions is defined, allowAdmin is effectively true
  if (options?.apiPermissions)
    return getUserOrApiSessionInput(req, schema, options?.apiPermissions);

  if (options?.allowAdmin) return getUserOrAdminSessionInput(req, schema);

  return getUserSessionInput(req, schema);
}
