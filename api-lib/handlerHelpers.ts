import assert from 'assert';

import { VercelRequest } from '@vercel/node';
import { z } from 'zod';

import {
  InputSchema,
  HasuraUserSessionVariables,
  composeHasuraActionRequestBodyWithSession,
} from './requests/schema';

export function getInput<T extends z.ZodRawShape>(
  req: VercelRequest,
  schema: InputSchema<T>
) {
  const fullSchema = composeHasuraActionRequestBodyWithSession(
    schema,
    HasuraUserSessionVariables
  );
  const { session_variables: session, input } = fullSchema.parse(req.body);

  // FIXME there should be a way to set up the types so that this isn't
  // necessary
  assert(input?.payload, 'input.payload is missing after parsing');

  return { session, payload: input.payload };
}
