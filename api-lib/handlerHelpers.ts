import assert from 'assert';

import { VercelRequest } from '@vercel/node';
import { z } from 'zod';

import { InputSchema, HasuraUserSessionVariables } from './requests/schema';

export function getInput<T extends z.ZodRawShape>(
  req: VercelRequest,
  schema: InputSchema<T>
) {
  const fullSchema = z.object({
    input: z.object({ payload: schema }),
    action: z.object({ name: z.string() }),
    session_variables: HasuraUserSessionVariables,
    request_query: z.string().optional(),
  });
  const { action, session_variables, input } = fullSchema.parse(req.body);

  // FIXME there should be a way to set up the types so that this isn't
  // necessary
  assert(input?.payload, 'input.payload is missing after parsing');

  return { action, session: session_variables, payload: input.payload };
}

export function getSession(req: VercelRequest) {
  const fullSchema = z.object({
    action: z.object({ name: z.string() }),
    session_variables: HasuraUserSessionVariables,
    request_query: z.string().optional(),
  });
  const { action, session_variables } = fullSchema.parse(req.body);
  return { action, session: session_variables };
}
