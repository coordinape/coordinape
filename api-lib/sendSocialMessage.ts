import fetch from 'node-fetch';

import { TELEGRAM_BOT_BASE_URL } from './config';
import { DISCORD_BOT_NAME, DISCORD_BOT_AVATAR_URL } from './constants';
import * as queries from './gql/queries';

type SocialMessage = {
  message: string;
  circleId: number;
  sanitize?: boolean;
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

  const { circles_by_pk: circle } = await queries.getCircle(circleId);

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

  if (TELEGRAM_BOT_BASE_URL && channels?.telegram && circle?.telegram_id) {
    const telegramBotPost = {
      chat_id: circle.telegram_id,
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
