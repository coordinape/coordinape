import * as queries from './gql/queries';
import { sendSocialMessage } from './sendSocialMessage';
import { EventTriggerPayload } from './types';

export default async function handleNomineeCreatedMsg(
  payload: EventTriggerPayload<'nominees', 'INSERT'>,
  channels: { discord?: boolean; telegram?: boolean }
) {
  const {
    event: { data },
  } = payload;

  const { nominees_by_pk } = await queries.getNominee(data.new.id);
  if (!nominees_by_pk) {
    return false;
  }

  if (channels.discord) {
    const { profile, nominator, vouches_required, circle_id, description } =
      nominees_by_pk;

    await sendSocialMessage({
      circleId: data.new.circle_id,
      channels: {
        discord: {
          type: 'nomination',
          channelId: '1057926498524332083', // TODO Find this from the circle
          roleId: '1058334400540061747', // TODO Find this from the circle
          nominee: profile?.name,
          nominator: nominator?.profile.name ?? nominator?.name,
          nominationReason: description,
          numberOfVouches: vouches_required,
          nominationLink: `https://app.coordinape.com/circles/${circle_id}/members`,
        },
      },
    });

    return true;
  }

  await sendSocialMessage({
    message:
      `${nominees_by_pk?.profile?.name} has been nominated by ${
        nominees_by_pk.nominator?.profile.name ?? nominees_by_pk.nominator?.name
      }!.` +
      ` You can vouch for them at https://app.coordinape.com/circles/${nominees_by_pk.circle_id}/members`,
    circleId: data.new.circle_id,
    sanitize: false,
    channels,
  });

  return true;
}
