import { webAppURL } from '../src/config/webAppURL';

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

  const {
    discord_channel_id: channelId,
    discord_role_id: roleId,
    alerts,
  } = circle?.discord_circle || {};

  if (channels?.isDiscordBot && channelId && roleId && alerts?.['nomination']) {
    const { circle_id, profile, nominator, description, vouches_required } =
      nominee || {};

    if (!circle_id || !profile || !nominator) {
      return null;
    }

    return {
      isDiscordBot: true,
      discordBot: {
        type: 'nomination' as const,
        channelId,
        roleId,
        circleId: circle_id.toString(),
        nominee: profile.name,
        nominator: nominator.profile.name,
        nominationReason: description ?? 'unknown',
        numberOfVouches: vouches_required ?? 0,
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
      `${nominee?.profile?.name} has been nominated by ${nominee.nominator?.profile.name}!.` +
      ` You can vouch for them at ${webAppURL('give')}/circles/${
        nominee.circle_id
      }/members`,
    circleId: data.new.circle_id,
    channels: getChannels({ nominee, channels, circle }),
    sanitize: false,
  });

  return true;
}
