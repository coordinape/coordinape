import type { VercelRequest, VercelResponse } from '@vercel/node';

import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import {
  createUserSchemaInput,
  composeHasuraActionRequestBody,
} from '../../../../src/lib/zod';

import { createUserMutation } from './createUserMutation';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload: input },
  } = composeHasuraActionRequestBody(createUserSchemaInput).parse(req.body);

  // External Constraint Validation
  // It might be preferable to add this uniqueness constraint into the database
  const { circle_id, address } = input;

  const mutationResult = await createUserMutation(address, circle_id, input);
  return res
    .status(200)
    .json(mutationResult.insert_users_one ?? mutationResult.update_users_by_pk);
}

export default authCircleAdminMiddleware(handler);
