import { gql } from '../../../../api-lib/Gql';
import { sendSocialMessage } from '../../../../api-lib/sendSocialMessage';
import { EventTriggerPayload } from '../../../../api-lib/types';

export default async function handleCheckNomineeMsg(
  payload: EventTriggerPayload<'nominees', 'UPDATE'>,
  channels: { discord?: boolean; telegram?: boolean }
) {
  const {
    event: { data },
  } = payload;

  if (data.old.ended === false && data.new.ended === true) {
    const { nominees_by_pk } = await gql.getNominee(data.new.id);

    if (nominees_by_pk) {
      const vouches =
        (nominees_by_pk.nominations_aggregate?.aggregate?.count ?? 0) + 1;
      let message;
      if (vouches >= data.new.vouches_required) {
        message = `${nominees_by_pk.name} has received enough vouches and is now in the circle`;
      } else if (new Date(data.new.expiry_date) < new Date()) {
        message = `Nominee ${nominees_by_pk.name} has only received ${nominees_by_pk.nominations_aggregate?.aggregate?.count} vouch(es) and has failed`;
      }

      if (message) {
        await sendSocialMessage({
          message,
          circleId: nominees_by_pk.circle_id,
          channels,
        });
        return true;
      }
    }
  }
  return false;
}
