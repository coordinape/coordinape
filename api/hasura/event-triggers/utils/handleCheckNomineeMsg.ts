import { gql } from '../../../../api-lib/Gql';
import { sendSocialMessage } from '../../../../api-lib/sendSocialMessage';
import { EventTriggerPayload } from '../../types';

export default async function handleCheckNomineeMsg(
  payload: EventTriggerPayload,
  channels: { discord?: boolean; telegram?: boolean }
) {
  const {
    event: { data },
  } = payload;

  if (
    data.old.ended === false &&
    data.new.ended === true &&
    new Date(data.new.expiry_date) < new Date()
  ) {
    const { nominees_by_pk } = await gql.getNominee(data.new.id);

    if (nominees_by_pk) {
      await sendSocialMessage({
        message: `Nominee ${nominees_by_pk.name} has only received ${nominees_by_pk.nominations_aggregate?.aggregate?.count} vouch(es) and has failed`,
        circleId: nominees_by_pk.circle_id,
        channels,
      });
      return true;
    }
  }
  return false;
}
