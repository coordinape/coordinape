import * as queries from '../../../api-lib/gql/queries';
import { isFeatureEnabled } from '../../../src/config/features';
import { NotFoundError } from '../../HttpError';
import {
  Channels,
  DiscordVouch,
  sendSocialMessage,
} from '../../sendSocialMessage';
import { Awaited } from '../../ts4.5shim';
import { EventTriggerPayload } from '../../types';

type GetChannelsProps = {
  channels: Channels<DiscordVouch>;
  circle: Awaited<ReturnType<typeof queries.getCircle>>['circles_by_pk'];
  nominee: Awaited<ReturnType<typeof queries.getNominee>>['nominees_by_pk'];
  vouch: Awaited<ReturnType<typeof queries.getExistingVouch>>['vouches'][0];
};

function getChannels(props: GetChannelsProps): Channels<DiscordVouch> {
  const {
    channels,
    vouch: { voucher },
    nominee,
    circle,
  } = props || {};

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
    alerts['vouch']
  ) {
    return {
      isDiscordBot: true,
      discordBot: {
        type: 'vouch' as const,
        channelId,
        roleId,
        circleId: circle?.id,
        nominee: nominee?.profile?.name,
        voucher: voucher?.profile.name ?? voucher?.name ?? 'Someone',
        nominationReason: nominee?.description ?? 'unknown reason',
        currentVouches: Math.max(
          0,
          nominee?.nominations_aggregate.aggregate?.count ?? 0
        ),
        requiredVouches: nominee?.vouches_required ?? 0,
      },
    };
  }

  return channels;
}

export default async function handleVouchMsg(
  payload: EventTriggerPayload<'vouches', 'INSERT'>,
  channels: { discord?: boolean; isDiscordBot?: boolean; telegram?: boolean }
) {
  const {
    event: { data },
  } = payload;

  // Unfortunately we have to look the vouch/voucher up here because the relationships aren't sent in the event
  const { vouches } = await queries.getExistingVouch(
    data.new.nominee_id,
    data.new.voucher_id
  );

  const vouch = vouches.pop();
  if (!vouch?.voucher) {
    throw new NotFoundError('voucher not found');
  }

  const nomineeId = data.new.nominee_id;

  const { nominees_by_pk: nominee } = await queries.getNominee(nomineeId);
  if (!nominee) {
    throw 'nominee not found ' + nomineeId;
  }

  const { circles_by_pk: circle } = await queries.getCircle(nominee.circle_id);

  // announce the vouching
  await sendSocialMessage({
    message: `${nominee.profile?.name} has been vouched for by ${
      vouch.voucher.profile.name ?? vouch.voucher.name
    }!`,
    circleId: nominee.circle_id,
    sanitize: true,
    channels: getChannels({ vouch, nominee, channels, circle }),
  });

  return true;
}
