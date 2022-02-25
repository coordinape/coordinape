import assert from 'assert';

import { gql } from './Gql';
import { sendSocialMessage } from './sendSocialMessage';
import { EventTriggerPayload } from './types';

export default async function handleRefundGiveMsg(
  payload: EventTriggerPayload<'pending_token_gifts', 'DELETE'>,
  channels: { discord?: boolean; telegram?: boolean }
) {
  const {
    event: { data },
  } = payload;

  const currentEpoch = await gql.getCurrentEpoch(data.old.circle_id);
  if (currentEpoch) {
    const { users_by_pk } = await gql.q('query')({
      users_by_pk: [{ id: data.old.sender_id }, { name: true }],
    });
    assert(users_by_pk);
    await sendSocialMessage({
      // note: give_token_received is susceptible to inconsistencies
      // and will be deprecated. This total will be removed when the column
      // is removed
      message: `${users_by_pk.name} has been refunded ${data.old.tokens} GIVE.`,
      circleId: data.old.circle_id,
      channels,
    });
    return true;
  }
  return false;
}
