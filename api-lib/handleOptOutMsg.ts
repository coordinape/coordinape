import { isFeatureEnabled } from '../src/config/features';

import * as queries from './gql/queries';
import {
  Channels,
  DiscordOptsOut,
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
  channels: Channels<DiscordOptsOut>;
  refunds?: {
    username: string;
    give: number;
  }[];
};

function getChannels(props: GetChannelsProps): Channels<DiscordOptsOut> {
  const { channels, circle, data, profiles, refunds } = props || {};

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
        type: 'user-opts-out' as const,
        channelId,
        roleId,
        discordId: user?.user_snowflake,
        address: data.new.address,
        circleName: circle?.name ?? 'Unknown',
        refunds: refunds ?? [],
      },
    };
  }

  return channels;
}

export default async function handleOptOutMsg(
  payload: EventTriggerPayload<'users', 'UPDATE'>,
  channels: { discord?: boolean; isDiscordBot?: boolean; telegram?: boolean }
) {
  const {
    event: { data },
  } = payload;

  if (data.old.non_receiver === false && data.new.non_receiver === true) {
    const currentEpoch = await queries.getCurrentEpoch(data.new.circle_id);

    if (currentEpoch) {
      const { circles_by_pk: circle } = await queries.getCircle(
        data.new.circle_id
      );

      const { profiles } = await queries.getProfileAndMembership(
        data.new.address
      );

      const { pending_token_gifts: refunds } =
        await queries.getPendingTokenGifts({
          senderId: data.new.id,
          epochId: currentEpoch.id,
        });

      await sendSocialMessage({
        // note: give_token_received is susceptible to inconsistencies
        // and will be deprecated. This total will be removed when the column
        // is removed
        message:
          `${data.new.name} has opted out of the current epoch.\n` +
          `A Total of ${data.old.give_token_received} ${
            circle?.token_name || 'GIVE'
          } was refunded`,
        circleId: data.new.circle_id,
        channels: getChannels({
          data,
          circle,
          channels,
          profiles,
          refunds: refunds
            .filter(({ tokens }) => tokens > 0)
            .map(({ recipient, tokens }) => ({
              username: recipient.name,
              give: tokens,
            })),
        }),
      });
      return true;
    }
  }

  if (data.old.non_giver === false && data.new.non_giver === true) {
    const currentEpoch = await queries.getCurrentEpoch(data.new.circle_id);

    if (currentEpoch) {
      const { circles_by_pk: circle } = await queries.getCircle(
        data.new.circle_id
      );

      const { profiles } = await queries.getProfileAndMembership(
        data.new.address
      );

      await sendSocialMessage({
        // note: give_token_received is susceptible to inconsistencies
        // and will be deprecated. This total will be removed when the column
        // is removed
        message:
          `${data.new.name} can no longer allocate GIVE during the current epoch.\n` +
          `A Total of ${
            data.old.starting_tokens - data.old.give_token_remaining
          } ${circle?.token_name || 'GIVE'} was refunded`,
        circleId: data.new.circle_id,
        channels: getChannels({ data, circle, channels, profiles }),
      });
      return true;
    }
  }
  return false;
}
