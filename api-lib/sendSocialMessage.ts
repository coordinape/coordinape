import fetch from 'node-fetch';

import { isFeatureEnabled } from '../src/config/features';

import { TELEGRAM_BOT_BASE_URL, COORDINAPE_BOT_SECRET } from './config';
import { DISCORD_BOT_NAME, DISCORD_BOT_AVATAR_URL } from './constants';
import * as queries from './gql/queries';

export type DiscordEpochEvent = {
  channelId: string;
  roleId: string;
};

export type Channels<T> = {
  discord?: boolean;
  discordBot?: T;
  isDiscordBot?: boolean;
  telegram?: boolean;
} | null;

export type DiscordNomination = DiscordEpochEvent & {
  type: 'nomination';
  circleId: string;
  nominee: string;
  nominator: string;
  nominationReason: string;
  numberOfVouches: number;
};

export type DiscordUserAddedOrRemoved = DiscordEpochEvent & {
  type: 'user-added' | 'user-removed';
  discordId?: string;
  address?: string;
  profileName?: string;
  circleName: string;
};

export type DiscordOptsOut = DiscordEpochEvent & {
  type: 'user-opts-out';
  discordId?: string;
  address?: string;
  profileName?: string;
  tokenName: string;
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
  circleId: string;
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
  circleId: string;
  nominee: string;
};

export type DiscordStart = DiscordEpochEvent & {
  type: 'start';
  epochName: string;
  circleId: string;
  circleName: string;
  startTime: string;
  endTime: string;
};

export type DiscordEnd = DiscordEpochEvent & {
  type: 'end';
  epochName: string;
  circleId: string;
  circleName: string;
  endTime: string;
  giveCount: number;
  userCount: number;
};

type SocialMessageChannels =
  | DiscordNomination
  | DiscordUserAddedOrRemoved
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

  if (isFeatureEnabled('discord') && channels?.isDiscordBot) {
    const { type } = channels.discordBot || {};
    const res = await fetch(
      `https://coordinape-discord-bot.herokuapp.com/api/epoch/${type}`,
      {
        method: 'POST',
        body: JSON.stringify(channels.discordBot),
        headers: {
          'Content-Type': 'application/json',
          'x-coordinape-bot-secret': COORDINAPE_BOT_SECRET,
        },
      }
    );

    if (!res.ok) {
      throw new Error(JSON.stringify(await res.json()));
    }
  }

  if (channels?.discord && circle?.discord_webhook) {
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
