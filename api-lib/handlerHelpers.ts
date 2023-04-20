import assert from 'assert';

import { VercelRequest } from '@vercel/node';
import { z } from 'zod';

import { InputSchema, HasuraUserSessionVariables } from './requests/schema';

function getUserSessionInput<T extends z.ZodRawShape>(
  req: VercelRequest,
  schema: InputSchema<T>
) {
  const fullSchema = z.object({
    action: z.object({ name: z.string() }),
    input: z.object({ payload: schema }),
    session_variables: HasuraUserSessionVariables,
    request_query: z.string().optional(),
  });
  const { action, session_variables, input } = fullSchema.parse(req.body);

  // FIXME there should be a way to set up the types so that this isn't
  // necessary
  assert(input?.payload, 'input.payload is missing after parsing');

  return { action, session: session_variables, payload: input.payload };
}

function getUserSessionNoInput(req: VercelRequest) {
  const fullSchema = z.object({
    action: z.object({ name: z.string() }),
    session_variables: HasuraUserSessionVariables,
    request_query: z.string().optional(),
  });
  const { action, session_variables } = fullSchema.parse(req.body);
  return { action, session: session_variables };
}

// this is a hack for getting ReturnType to work with generics
// https://stackoverflow.com/questions/50321419/typescript-returntype-of-generic-function?noredirect=1&lq=1
class Wrapper<T extends z.ZodRawShape> {
  wrapped(req: VercelRequest, schema: InputSchema<T>) {
    return getUserSessionInput<T>(req, schema);
  }
}

export function getInput(
  req: VercelRequest
): ReturnType<typeof getUserSessionNoInput>;
export function getInput<T extends z.ZodRawShape>(
  req: VercelRequest,
  schema: InputSchema<T>
): ReturnType<Wrapper<T>['wrapped']>;
export function getInput<T extends z.ZodRawShape>(
  req: VercelRequest,
  schema?: InputSchema<T>
) {
  if (!schema) return getUserSessionNoInput(req);
  return getUserSessionInput(req, schema);
}
