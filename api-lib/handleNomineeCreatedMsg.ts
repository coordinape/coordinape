import { isFeatureEnabled } from '../src/config/features';

import * as queries from './gql/queries';
import {
  Channels,
  DiscordNomination,
  sendSocialMessage,
} from './sendSocialMessage';
import { Awaited } from './ts4.5shim';
import { EventTriggerPayload } from './types';

type GetChannelsProps = {
  nominee: Awaited<ReturnType<typeof queries.getNominee>>['nominees_by_pk'];
  channels: Channels<DiscordNomination>;
  circle: Awaited<ReturnType<typeof queries.getCircle>>['circles_by_pk'];
};

function getChannels(props: GetChannelsProps): Channels<DiscordNomination> {
  const { channels, nominee, circle } = props || {};

  const { discord_channel_id: channelId, discord_role_id: roleId } =
    circle?.discord_circle || {};

  if (isFeatureEnabled('discord') && channelId && roleId) {
    const { circle_id, profile, nominator, description, vouches_required } =
      nominee || {};

    if (!profile || !nominator) {
      return null;
    }

    return {
      discordBot: {
        type: 'nomination' as const,
        channelId,
        roleId,
        nominee: profile.name,
        nominator: nominator.profile.name ?? nominator.name,
        nominationReason: description ?? 'unknown',
        numberOfVouches: vouches_required ?? 0,
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

  const { nominees_by_pk: nominee } = await queries.getNominee(data.new.id);

  if (!nominee) {
    return false;
  }

  const { circles_by_pk: circle } = await queries.getCircle(nominee.circle_id);

  await sendSocialMessage({
    message:
      `${nominee?.profile?.name} has been nominated by ${
        nominee.nominator?.profile.name ?? nominee.nominator?.name
      }!.` +
      ` You can vouch for them at https://app.coordinape.com/circles/${nominee.circle_id}/members`,
    circleId: data.new.circle_id,
    channels: getChannels({ nominee, channels, circle }),
    sanitize: false,
  });

  return true;
}
