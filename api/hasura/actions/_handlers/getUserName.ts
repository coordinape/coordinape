import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { InternalServerError } from '../../../../api-lib/HttpError';
import { zEthAddress } from '../../../../src/lib/zod/formHelpers';

const getUserNameInput = z.object({
  address: zEthAddress.or(z.literal('')),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload } = await getInput(req, getUserNameInput);

  try {
    const { profiles } = await adminClient.query(
      {
        profiles: [
          { where: { address: { _ilike: payload.address } }, limit: 1 },
          { name: true },
        ],
      },
      { operationName: 'getUserName' }
    );
    assert(profiles, 'failed to fetch user profile');
    const name = profiles[0]?.name ?? '';
    return res.status(200).json({ name });
  } catch (e) {
    throw new InternalServerError('Unable to fetch user name', e);
  }
}
