import { gql } from './Gql';
import { sendSocialMessage } from './sendSocialMessage';
import { EventTriggerPayload } from './types';

export default async function handleNomineeCreatedMsg(
  payload: EventTriggerPayload<'nominees', 'INSERT'>,
  channels: { discord?: boolean; telegram?: boolean }
) {
  const {
    event: { data },
  } = payload;

  const { nominees_by_pk } = await gql.getNominee(data.new.id);
  if (nominees_by_pk) {
    await sendSocialMessage({
      message:
        `${data.new.name} has been nominated by ${nominees_by_pk.nominator?.name}!.` +
        ` You can vouch for them at https://app.coordinape.com/vouching`,
      circleId: data.new.circle_id,
      sanitize: false,
      channels,
    });
    return true;
  }

  return false;
}
