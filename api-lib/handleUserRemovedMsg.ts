import { isFeatureEnabled } from '../src/config/features';

import * as queries from './gql/queries';
import {
  Channels,
  DiscordUserAddedOrRemoved,
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
  channels: Channels<DiscordUserAddedOrRemoved>;
};

function getChannels(
  props: GetChannelsProps
): Channels<DiscordUserAddedOrRemoved> {
  const { channels, circle, data, profiles } = props || {};

  const {
    discord_channel_id: channelId,
    discord_role_id: roleId,
    alerts,
  } = circle?.discord_circle || {};

  if (
    channels?.isDiscordBot &&
    isFeatureEnabled('discord') &&
    channelId &&
    roleId &&
    alerts?.['user-removed']
  ) {
    const discordId = profiles[0].user?.user_snowflake;
    const profileName = profiles[0].name;

    return {
      isDiscordBot: true,
      discordBot: {
        type: 'user-removed',
        channelId,
        roleId,
        discordId,
        address: data.new.address,
        profileName,
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
      message: `${profiles[0].name} has left the circle.`,
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
