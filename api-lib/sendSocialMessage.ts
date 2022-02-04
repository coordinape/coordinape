import fetch from 'node-fetch';

import { TELEGRAM_BOT_BASE_URL } from './config';
import { DISCORD_BOT_NAME, DISCORD_BOT_AVATAR_URL } from './constants';
import { gql } from './Gql';

type SocialMessage = {
  message: string;
  circleId: number;
  sanitize: boolean;
  channels: {
    discord?: boolean;
    telegram?: boolean;
  };
};

function cleanStr(str: string) {
  return str.replace(/:|-|\/|\*|_|`/g, '');
}

export async function sendSocialMessage({
  message,
  circleId,
  sanitize = true,
  channels,
}: SocialMessage) {
  const msg = sanitize ? cleanStr(message) : message;

  const { circles } = await gql.q('query')({
    circles: [
      {
        where: {
          id: {
            _eq: circleId,
          },
        },
      },
      {
        discord_webhook: true,
        telegram_id: true,
      },
    ],
  });

  const [{ discord_webhook, telegram_id }] = circles;

  if (channels?.discord && discord_webhook) {
    const discordWebhookPost = {
      content: msg,
      username: DISCORD_BOT_NAME,
      avatar_url: DISCORD_BOT_AVATAR_URL,
    };
    const res = await fetch(discord_webhook, {
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

  if (channels?.telegram && telegram_id) {
    const telegramBotPost = {
      chat_id: telegram_id,
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
