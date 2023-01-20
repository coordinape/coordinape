import fetch from 'node-fetch';

import { TELEGRAM_BOT_BASE_URL } from './config';
import * as queries from './gql/queries';
import { isDiscordEpochEvent } from './utils/isDiscordEpochEvent';

export type DiscordEpochEvent = {
  channelId: string;
  roleId: string;
};

export type DiscordNomination = DiscordEpochEvent & {
  type: 'nomination';
  nominee: string;
  nominator: string;
  nominationReason: string;
  numberOfVouches: number;
  nominationLink: string;
};

type SocialMessage = {
  message?: string;
  circleId: number;
  sanitize?: boolean;
  channels: {
    discord?: DiscordNomination | boolean; // `boolean` just for backward compatibility for now, will be removed
    telegram?: boolean;
  };
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

  if (isDiscordEpochEvent(channels.discord)) {
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
