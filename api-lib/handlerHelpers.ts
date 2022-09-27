import { VercelRequest } from '@vercel/node';
import { z } from 'zod';

import {
  InputSchema,
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
} from '../src/lib/zod';

export function getPropsWithUserSession<T extends z.ZodRawShape>(
  schema: InputSchema<T>,
  req: VercelRequest
) {
  return composeHasuraActionRequestBodyWithSession(
    schema,
    HasuraUserSessionVariables
  ).parse(req.body);
}
