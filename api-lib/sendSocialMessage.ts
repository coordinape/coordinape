import fetch from 'node-fetch';

import { isFeatureEnabled } from '../src/config/features';

import { TELEGRAM_BOT_BASE_URL } from './config';
import { DISCORD_BOT_NAME, DISCORD_BOT_AVATAR_URL } from './constants';
import * as queries from './gql/queries';
import { isDiscordEpochEvent } from './utils/isDiscordEpochEvent';

export type DiscordEpochEvent = {
  channelId: string;
  roleId: string;
};

export type Channels<T> = {
  discord?: T | boolean; // `boolean` just for backward compatibility for now, will be removed
  telegram?: boolean;
};

export type DiscordNomination = DiscordEpochEvent & {
  type: 'nomination';
  nominee: string;
  nominator: string;
  nominationReason: string;
  numberOfVouches: number;
  nominationLink: string;
};

export type DiscordOptsOut = DiscordEpochEvent & {
  type: 'user-opts-out';
  discordId?: string;
  address?: string;
  circleName: string;
  refunds: {
    username: string;
    give: number;
  }[];
};

export type DiscordVouch = DiscordEpochEvent & {
  type: 'vouch';
  nominee: string;
  voucher: string;
  nominationReason: string;
  currentVouches: number;
  requiredVouches: number;
};

export type DiscordVouchSuccessful = DiscordEpochEvent & {
  type: 'vouch-successful';
  nominee: string;
  nomineeProfile: string;
  vouchers: string[];
  nominationReason: string;
};

export type DiscordVouchUnsuccessful = DiscordEpochEvent & {
  type: 'vouch-unsuccessful';
  nominee: string;
};

export type DiscordStart = DiscordEpochEvent & {
  type: 'start';
  epochName: string;
  circleName: string;
  startTime: string;
  endTime: string;
};

export type DiscordEnd = DiscordEpochEvent & {
  type: 'end';
  epochName: string;
  circleName: string;
  endTime: string;
  giveCount: number;
  userCount: number;
  circleHistoryLink: string;
};

type SocialMessageChannels =
  | DiscordNomination
  | DiscordOptsOut
  | DiscordVouch
  | DiscordVouchSuccessful
  | DiscordVouchUnsuccessful
  | DiscordStart
  | DiscordEnd;

type SocialMessage = {
  message?: string;
  circleId: number;
  sanitize?: boolean;
  channels: Channels<SocialMessageChannels>;
  notifyOrg?: boolean;
};

function cleanStr(str?: string) {
  if (!str) {
    return '';
  }
  return str.replace(/:|-|\/|\*|_|`/g, '');
}

export async function sendSocialMessage({
  message,
  circleId,
  sanitize = true,
  channels,
  notifyOrg = false,
}: SocialMessage) {
  const msg = sanitize ? cleanStr(message) : message;

  const { circles_by_pk: circle } = await queries.getCircle(circleId);

  if (isFeatureEnabled('discord') && isDiscordEpochEvent(channels.discord)) {
    const { type } = channels.discord;
    // TODO Fix the discord bot endpoint
    const res = await fetch(`http://localhost:4000/api/epoch/${type}`, {
      method: 'POST',
      body: JSON.stringify(channels.discord),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(JSON.stringify(await res.json()));
    }
  }

  if (
    !isFeatureEnabled('discord') &&
    !isDiscordEpochEvent(channels.discord) &&
    channels?.discord &&
    circle?.discord_webhook
  ) {
    const discordWebhookPost = {
      content: msg,
      username: DISCORD_BOT_NAME,
      avatar_url: DISCORD_BOT_AVATAR_URL,
    };
    const res = await fetch(circle.discord_webhook, {
      method: 'POST',
      body: JSON.stringify(discordWebhookPost),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error(JSON.stringify(await res.json()));
    }
  }

  const channelId = notifyOrg
    ? circle?.organization?.telegram_id
    : circle?.telegram_id;
  if (TELEGRAM_BOT_BASE_URL && channels?.telegram && channelId) {
    const telegramBotPost = {
      chat_id: channelId,
      text: msg,
    };
    const res = await fetch(`${TELEGRAM_BOT_BASE_URL}/sendMessage`, {
      method: 'POST',
      body: JSON.stringify(telegramBotPost),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(JSON.stringify(await res.json()));
    }
  }
}
