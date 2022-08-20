import { VercelRequest, VercelResponse } from '@vercel/node';

import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import { endNominees, updateCircle } from '../../../../api-lib/gql/mutations';
import {
  composeHasuraActionRequestBodyWithApiPermissions,
  updateCircleInput,
} from '../../../../src/lib/zod';

const requestSchema = composeHasuraActionRequestBodyWithApiPermissions(
  updateCircleInput,
  ['update_circle']
);

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload: input },
  } = await requestSchema.parseAsync(req.body);

  const updated = await updateCircle(input);

  if (!input.vouching) {
    await endNominees(input.circle_id);
  }
  res.status(200).json(updated);
}

export default authCircleAdminMiddleware(handler);
