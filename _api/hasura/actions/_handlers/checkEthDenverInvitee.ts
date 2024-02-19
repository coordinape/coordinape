import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getEthDenverInviterProfileId } from '../../../../api-lib/colinks/helperAccounts';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { InternalServerError } from '../../../../api-lib/HttpError';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    session: { hasuraProfileId: profileId },
  } = await getInput(req);
  try {
    const { profiles_by_pk: profile } = await adminClient.query(
      { profiles_by_pk: [{ id: profileId }, { invited_by: true }] },
      { operationName: 'checkEthDenverInvitee__getInviterId' }
    );
    const inviterId = await getEthDenverInviterProfileId();
    return res
      .status(200)
      .json({ is_eth_denver_invitee: profile?.invited_by === inviterId });
  } catch (e) {
    throw new InternalServerError('Unable to fetch eth denver invitee data', e);
  }
}
