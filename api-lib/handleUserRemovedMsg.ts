import { isFeatureEnabled } from '../src/config/features';

import * as queries from './gql/queries';
import {
  Channels,
  DiscordUserRemoved,
  sendSocialMessage,
} from './sendSocialMessage';
import { Awaited } from './ts4.5shim';
import { EventTriggerPayload } from './types';

type GetChannelsProps = {
  data: EventTriggerPayload<'users', 'UPDATE'>['event']['data'];
  circle: Awaited<ReturnType<typeof queries.getCircle>>['circles_by_pk'];
  profiles: Awaited<
    ReturnType<typeof queries.getProfileAndMembership>
  >['profiles'];
  channels: Channels<DiscordUserRemoved>;
};

function getChannels(props: GetChannelsProps): Channels<DiscordUserRemoved> {
  const { channels, circle, data, profiles } = props || {};

  const { discord_channel_id: channelId, discord_role_id: roleId } =
    circle?.discord_circle || {};

  if (
    channels?.isDiscordBot &&
    isFeatureEnabled('discord') &&
    channelId &&
    roleId
  ) {
    const user = profiles[0].user;

    return {
      isDiscordBot: true,
      discordBot: {
        type: 'user-removed',
        channelId,
        roleId,
        discordId: user?.user_snowflake,
        address: data.new.address,
        circleName: circle?.name ?? 'Unknown',
      },
    };
  }

  return channels;
}

export default async function handleUserRemovedMsg(
  payload: EventTriggerPayload<'users', 'UPDATE'>,
  channels: { isDiscordBot?: boolean; discord?: boolean; telegram?: boolean }
) {
  const {
    event: { data },
  } = payload;

  if (!data.old.deleted_at && data.new.deleted_at) {
    const { circles_by_pk: circle } = await queries.getCircle(
      data.new.circle_id
    );
    const { profiles } = await queries.getProfileAndMembership(
      data.new.address
    );
    await sendSocialMessage({
      message: `${data.new.name} has left the circle.`,
      circleId: data.new.circle_id,
      channels: getChannels({
        data,
        circle,
        channels,
        profiles,
      }),
    });
  }
  return true;
}
