import { webAppURL } from '../../../src/config/webAppURL';
import * as queries from '../../gql/queries';
import {
  Channels,
  DiscordVouchSuccessful,
  DiscordVouchUnsuccessful,
  sendSocialMessage,
} from '../../sendSocialMessage';
import { Awaited } from '../../ts4.5shim';
import { EventTriggerPayload } from '../../types';

type Nominee = Awaited<ReturnType<typeof queries.getNominee>>['nominees_by_pk'];

type GetChannelsVouchUnsuccessfulProps = {
  payload: EventTriggerPayload<'nominees', 'UPDATE'>;
  channels: Channels<DiscordVouchUnsuccessful>;
  circle: Awaited<ReturnType<typeof queries.getCircle>>['circles_by_pk'];
  nominee: Nominee;
};

type GetChannelsVouchSuccessfulProps = {
  payload: EventTriggerPayload<'nominees', 'UPDATE'>;
  channels: Channels<DiscordVouchSuccessful>;
  circle: Awaited<ReturnType<typeof queries.getCircle>>['circles_by_pk'];
  nominee: Nominee;
};

function getChannelsVouchUnsuccessful(
  props: GetChannelsVouchUnsuccessfulProps
): Channels<DiscordVouchUnsuccessful> {
  const { channels, circle, nominee } = props || {};

  const {
    discord_channel_id: channelId,
    discord_role_id: roleId,
    alerts,
  } = circle?.discord_circle || {};

  if (
    channels?.isDiscordBot &&
    channelId &&
    roleId &&
    alerts?.['vouch-unsuccessful']
  ) {
    const { profile } = nominee || {};

    if (!profile) {
      return null;
    }

    return {
      isDiscordBot: true,
      discordBot: {
        type: 'vouch-unsuccessful' as const,
        channelId,
        roleId,
        circleId: circle?.id,
        nominee: profile.name,
      },
    };
  }

  return channels;
}

function getChannelsVouchSuccessful(
  props: GetChannelsVouchSuccessfulProps
): Channels<DiscordVouchSuccessful> {
  const { payload, channels, circle, nominee } = props || {};

  const {
    discord_channel_id: channelId,
    discord_role_id: roleId,
    alerts,
  } = circle?.discord_circle || {};

  if (
    channels?.isDiscordBot &&
    channelId &&
    roleId &&
    alerts?.['vouch-successful']
  ) {
    const { profile, address, nominations } = nominee || {};

    if (!profile || !address || !nominations) {
      return null;
    }

    return {
      isDiscordBot: true,
      discordBot: {
        type: 'vouch-successful' as const,
        channelId,
        roleId,
        nominee: profile.name,
        nomineeProfile: `${webAppURL('give')}/profile/${address}`,
        nominationReason: payload.event.data.new.description,
        vouchers: nominations.map(({ voucher }) => voucher?.profile.name) ?? [],
      },
    };
  }

  return channels;
}

export default async function handleCheckNomineeMsg(
  payload: EventTriggerPayload<'nominees', 'UPDATE'>,
  channels: { discord?: boolean; isDiscordBot?: boolean; telegram?: boolean }
) {
  const {
    event: { data },
  } = payload;

  if (data.old.ended === false && data.new.ended === true) {
    const { nominees_by_pk: nominee } = await queries.getNominee(data.new.id);

    if (nominee) {
      const vouches =
        (nominee.nominations_aggregate?.aggregate?.count ?? 0) + 1;

      if (vouches >= data.new.vouches_required) {
        const { circles_by_pk: circle } = await queries.getCircle(
          nominee.circle_id
        );
        await sendSocialMessage({
          message: `${nominee.profile?.name} has received enough vouches and is now in the circle`,
          channels: getChannelsVouchSuccessful({
            payload,
            nominee,
            channels,
            circle,
          }),
          circleId: nominee.circle_id,
        });
        return true;
      }

      if (new Date(data.new.expiry_date) < new Date()) {
        const { circles_by_pk: circle } = await queries.getCircle(
          nominee.circle_id
        );

        const vouches = nominee.nominations_aggregate?.aggregate?.count ?? 0;

        await sendSocialMessage({
          message: `Nominee ${
            nominee.profile?.name
          } has only received ${vouches} vouch${
            vouches === 1 ? '' : 'es'
          } and has failed`,
          channels: getChannelsVouchUnsuccessful({
            payload,
            nominee,
            channels,
            circle,
          }),
          circleId: nominee.circle_id,
        });
        return true;
      }
    }
  }
  return false;
}
