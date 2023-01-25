import { isFeatureEnabled } from '../src/config/features';

import * as queries from './gql/queries';
import { Channels, sendSocialMessage } from './sendSocialMessage';
import { Awaited } from './ts4.5shim';
import { EventTriggerPayload } from './types';

type GetChannelsProps = Awaited<
  ReturnType<typeof queries.getNominee>
>['nominees_by_pk'] & { channels: Channels };

function getChannels(props: GetChannelsProps) {
  const {
    channels,
    circle_id,
    profile,
    nominator,
    description,
    vouches_required,
  } = props || {};

  if (isFeatureEnabled('discord') && channels.discord) {
    return {
      discord: {
        type: 'nomination' as const,
        channelId: '1067789668290146324', // TODO Find this from the circle
        roleId: '1058334400540061747', // TODO Find this from the circle
        nominee: profile?.name,
        nominator: nominator?.profile.name ?? nominator?.name,
        nominationReason: description,
        numberOfVouches: vouches_required,
        nominationLink: `https://app.coordinape.com/circles/${circle_id}/members`,
      },
    };
  }

  return channels;
}

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

  await sendSocialMessage({
    message:
      `${nominees_by_pk?.profile?.name} has been nominated by ${
        nominees_by_pk.nominator?.profile.name ?? nominees_by_pk.nominator?.name
      }!.` +
      ` You can vouch for them at https://app.coordinape.com/circles/${nominees_by_pk.circle_id}/members`,
    circleId: data.new.circle_id,
    channels: getChannels({ ...nominees_by_pk, channels }),
    sanitize: false,
  });

  return true;
}
