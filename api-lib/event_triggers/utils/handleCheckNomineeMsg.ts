import { isFeatureEnabled } from '../../../src/config/features';
import * as queries from '../../gql/queries';
import {
  Channels,
  DiscordVouchSuccessful,
  DiscordVouchUnsuccessful,
  sendSocialMessage,
} from '../../sendSocialMessage';
import { Awaited } from '../../ts4.5shim';
import { EventTriggerPayload } from '../../types';

type GetChannelsVouchUnsuccessfulProps = {
  nominee: Awaited<ReturnType<typeof queries.getNominee>>['nominees_by_pk'];
} & {
  channels: Channels<DiscordVouchUnsuccessful>;
};

type GetChannelsVouchSuccessfulProps = {
  nominee: Awaited<ReturnType<typeof queries.getNominee>>['nominees_by_pk'];
} & {
  channels: Channels<DiscordVouchSuccessful>;
};

function getChannelsVouchUnsuccessful(
  props: GetChannelsVouchUnsuccessfulProps
): Channels<DiscordVouchUnsuccessful> {
  const { channels, nominee } = props || {};

  if (isFeatureEnabled('discord') && channels.discordBot) {
    return {
      discordBot: {
        type: 'vouch-unsuccessful' as const,
        channelId: '1067789668290146324', // TODO Find this from the circle
        roleId: '1058334400540061747', // TODO Find this from the circle
        nominee: nominee?.profile?.name,
      },
    };
  }

  return channels;
}

function getChannelsVouchSuccessful(
  props: GetChannelsVouchSuccessfulProps
): Channels<DiscordVouchSuccessful> {
  const { channels, nominee } = props || {};

  if (isFeatureEnabled('discord') && channels.discordBot) {
    return {
      discordBot: {
        type: 'vouch-successful' as const,
        // these are available in the returned `circle` object now
        channelId: '1067789668290146324', // TODO Find this from the circle
        roleId: '1058334400540061747', // TODO Find this from the circle
        nominee: nominee?.profile?.name,
        nomineeProfile: `https://app.coordinape.com//profile/${nominee?.address}`,
        // nominateReason: available in the event trigger payload in the `description` column
        nominationReason: '', // TODO Do we even have this?
        // vouchers: available in the `vouches` table via the `nominations`
        vouchers: [], // TODO Where to get this from?
      },
    };
  }

  return channels;
}

export default async function handleCheckNomineeMsg(
  payload: EventTriggerPayload<'nominees', 'UPDATE'>,
  channels: { discord?: boolean; telegram?: boolean }
) {
  const {
    event: { data },
  } = payload;

  if (data.old.ended === false && data.new.ended === true) {
    const { nominees_by_pk } = await queries.getNominee(data.new.id);

    if (nominees_by_pk) {
      const vouches =
        (nominees_by_pk.nominations_aggregate?.aggregate?.count ?? 0) + 1;

      if (vouches >= data.new.vouches_required) {
        await sendSocialMessage({
          message: `${nominees_by_pk.profile?.name} has received enough vouches and is now in the circle`,
          circleId: nominees_by_pk.circle_id,
          channels: getChannelsVouchSuccessful({
            nominee: nominees_by_pk,
            channels,
          }),
        });
        return true;
      } else if (new Date(data.new.expiry_date) < new Date()) {
        await sendSocialMessage({
          message: `Nominee ${nominees_by_pk.profile?.name} has only received ${nominees_by_pk.nominations_aggregate?.aggregate?.count} vouch(es) and has failed`,
          circleId: nominees_by_pk.circle_id,
          channels: getChannelsVouchUnsuccessful({
            nominee: nominees_by_pk,
            channels,
          }),
        });
        return true;
      }
    }
  }
  return false;
}
