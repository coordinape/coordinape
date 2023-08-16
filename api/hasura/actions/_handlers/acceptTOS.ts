/* eslint-disable no-console */
import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { errorResponse } from '../../../../api-lib/HttpError';
import { HasuraUserSessionVariables } from '../../../../api-lib/requests/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { hasuraProfileId } = HasuraUserSessionVariables.parse(
      req.body.session_variables
    );

    const { update_profiles_by_pk } = await adminClient.mutate(
      {
        update_profiles_by_pk: [
          {
            pk_columns: { id: hasuraProfileId },
            _set: { tos_agreed_at: 'now()' },
          },
          { tos_agreed_at: true },
        ],
      },
      { operationName: 'acceptTOS__set_tos_agreed_at' }
    );

    assert(update_profiles_by_pk);

    return res
      .status(200)
      .json({ tos_agreed_at: update_profiles_by_pk.tos_agreed_at });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}
