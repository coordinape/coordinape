import fetch from 'node-fetch';

import { TELEGRAM_BOT_BASE_URL, COORDINAPE_BOT_SECRET } from './config';
import {
  DISCORD_BOT_NAME,
  DISCORD_BOT_AVATAR_URL,
  DISCORD_BOT_EPOCH_URL,
} from './constants';
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

export type DiscordDailyUpdate = DiscordEpochEvent & {
  type: 'daily-update';
  message: string;
};

type SocialMessageChannels =
  | DiscordNomination
  | DiscordUserAddedOrRemoved
  | DiscordOptsOut
  | DiscordVouch
  | DiscordVouchSuccessful
  | DiscordVouchUnsuccessful
  | DiscordStart
  | DiscordEnd
  | DiscordDailyUpdate;

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

  const requests = [];

  if (channels?.isDiscordBot && channels?.discordBot) {
    const { type } = channels.discordBot || {};
    const updateDiscordBot = fetch(`${DISCORD_BOT_EPOCH_URL}/${type}`, {
      method: 'POST',
      body: JSON.stringify(channels.discordBot),
      headers: {
        'Content-Type': 'application/json',
        'x-coordinape-bot-secret': COORDINAPE_BOT_SECRET,
      },
    }).then(res => {
      if (!res.ok) {
        console.error(
          'Error updating discord-bot:',
          res.status,
          res.statusText
        );
        return res.json().then(json => {
          throw new Error(json);
        });
      }
    });
    requests.push(updateDiscordBot);
  }

  if (channels?.discord && circle?.discord_webhook) {
    const discordWebhookPost = {
      content: msg,
      username: DISCORD_BOT_NAME,
      avatar_url: DISCORD_BOT_AVATAR_URL,
    };
    const updateDiscordWebhook = fetch(circle.discord_webhook, {
      method: 'POST',
      body: JSON.stringify(discordWebhookPost),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => {
      if (!res.ok) {
        console.error(
          'Error updating discord-webhook:',
          res.status,
          res.statusText
        );
        return res.json().then(json => {
          throw new Error(json);
        });
      }
    });
    requests.push(updateDiscordWebhook);
  }

  const channelId = notifyOrg
    ? circle?.organization?.telegram_id
    : circle?.telegram_id;
  if (TELEGRAM_BOT_BASE_URL && channels?.telegram && channelId) {
    const telegramBotPost = {
      chat_id: channelId,
      text: msg,
    };
    const updateTelegramBot = fetch(`${TELEGRAM_BOT_BASE_URL}/sendMessage`, {
      method: 'POST',
      body: JSON.stringify(telegramBotPost),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => {
      if (!res.ok) {
        console.error(
          'Error updating telegram-bot:',
          res.status,
          res.statusText
        );
        return res.json().then(json => {
          throw new Error(json);
        });
      }
    });
    requests.push(updateTelegramBot);
  }

  await Promise.all(requests).catch(err => {
    console.error('Error sending social message', err);
  });
}
