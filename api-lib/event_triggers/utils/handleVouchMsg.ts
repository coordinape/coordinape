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

type Vouch = Awaited<ReturnType<typeof queries.getExistingVouch>>['vouches'][0];

type Nominee = Awaited<ReturnType<typeof queries.getNominee>>['nominees_by_pk'];

type GetChannelsProps = { vouch: Vouch } & { nominee: Nominee } & {
  channels: Channels<DiscordVouch>;
};

function getChannels(props: GetChannelsProps): Channels<DiscordVouch> {
  const {
    channels,
    vouch: { voucher },
    nominee,
  } = props || {};

  if (isFeatureEnabled('discord') && channels.discord) {
    return {
      discord: {
        type: 'vouch' as const,
        channelId: '1067789668290146324', // TODO Find this from the circle
        roleId: '1058334400540061747', // TODO Find this from the circle
        nominee: nominee?.profile?.name,
        voucher: voucher?.profile.name ?? voucher?.name ?? 'Someone',
        nominationReason: 'nominationReason', // TODO Do we even have this?
        currentVouches: 0, // TODO Where to get this from?
        requiredVouches: 0, // TODO Where to get this from?
      },
    };
  }

  return channels;
}

export default async function handleVouchMsg(
  payload: EventTriggerPayload<'vouches', 'INSERT'>,
  channels: { discord?: boolean; telegram?: boolean }
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

  const { nominees_by_pk } = await queries.getNominee(nomineeId);
  if (!nominees_by_pk) {
    throw 'nominee not found ' + nomineeId;
  }

  // announce the vouching
  await sendSocialMessage({
    message: `${nominees_by_pk.profile?.name} has been vouched for by ${
      vouch.voucher.profile.name ?? vouch.voucher.name
    }!`,
    circleId: nominees_by_pk.circle_id,
    sanitize: true,
    channels: getChannels({ vouch, nominee: nominees_by_pk, channels }),
  });

  return true;
}
