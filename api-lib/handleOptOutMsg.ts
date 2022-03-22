import * as queries from './gql/queries';
import { sendSocialMessage } from './sendSocialMessage';
import { EventTriggerPayload } from './types';

export default async function handleOptOutMsg(
  payload: EventTriggerPayload<'users', 'UPDATE'>,
  channels: { discord?: boolean; telegram?: boolean }
) {
  const {
    event: { data },
  } = payload;

  if (data.old.non_receiver === false && data.new.non_receiver === true) {
    const currentEpoch = await queries.getCurrentEpoch(data.new.circle_id);

    if (currentEpoch) {
      await sendSocialMessage({
        // note: give_token_received is susceptible to inconsistencies
        // and will be deprecated. This total will be removed when the column
        // is removed
        message:
          `${data.new.name} has opted out of the current epoch.\n` +
          `A Total of ${data.old.give_token_received} GIVE was refunded`,
        circleId: data.new.circle_id,
        channels,
      });
      return true;
    }
  }
  if (data.old.non_giver === false && data.new.non_giver === true) {
    const currentEpoch = await queries.getCurrentEpoch(data.new.circle_id);

    if (currentEpoch) {
      await sendSocialMessage({
        // note: give_token_received is susceptible to inconsistencies
        // and will be deprecated. This total will be removed when the column
        // is removed
        message:
          `${data.new.name} can no longer allocate GIVE during the current epoch.\n` +
          `A Total of ${
            data.old.starting_tokens - data.old.give_token_remaining
          } GIVE was refunded`,
        circleId: data.new.circle_id,
        channels,
      });
      return true;
    }
  }
  return false;
}
