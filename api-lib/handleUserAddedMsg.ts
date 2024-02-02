import * as queries from './gql/queries';
import {
  Channels,
  DiscordUserAddedOrRemoved,
  sendSocialMessage,
} from './sendSocialMessage';
import { Awaited } from './ts4.5shim';
import { EventTriggerPayload } from './types';

type GetChannelsProps = {
  data: EventTriggerPayload<'users', 'INSERT' | 'UPDATE'>['event']['data'];
  circle: Awaited<ReturnType<typeof queries.getCircle>>['circles_by_pk'];
  profiles: Awaited<
    ReturnType<typeof queries.getProfileAndMembership>
  >['profiles'];
  channels: Channels<DiscordUserAddedOrRemoved>;
};

function getChannels(
  props: GetChannelsProps
): Channels<DiscordUserAddedOrRemoved> {
  const { channels, circle, profiles } = props || {};

  const {
    discord_channel_id: channelId,
    discord_role_id: roleId,
    alerts,
  } = circle?.discord_circle || {};

  if (channels?.isDiscordBot && channelId && roleId && alerts?.['user-added']) {
    const discordId = profiles[0].user?.user_snowflake;
    const profileName = profiles[0].name;
    const address = profiles[0].address;

    return {
      isDiscordBot: true,
      discordBot: {
        type: 'user-added',
        channelId,
        roleId,
        discordId,
        address,
        profileName,
        circleName: circle?.name ?? 'Unknown',
      },
    };
  }

  return channels;
}

export default async function handleUserAddedMsg(
  payload: EventTriggerPayload<'users', 'INSERT' | 'UPDATE'>,
  channels: { isDiscordBot?: boolean; discord?: boolean; telegram?: boolean }
) {
  const {
    event: { data },
  } = payload;

  if (!data.old || (data.old.deleted_at && !data.new.deleted_at)) {
    const { circles_by_pk: circle } = await queries.getCircle(
      data.new.circle_id
    );
    const { profiles } = await queries.getProfileAndMembership(
      data.new.profile_id
    );
    await sendSocialMessage({
      message: `${profiles[0].name} has been added to the circle.`,
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
