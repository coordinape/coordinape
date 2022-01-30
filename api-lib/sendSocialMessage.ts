import fetch from 'node-fetch';

import { gql } from './Gql';

const DISCORD_BOT_NAME = 'Caesar The Coordinape Bot';

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
    // https://discord.com/api/webhooks/937364127595245569/dZGmCuPxt3knbTEl1QtvVQnyppK8CoHV9dvBdsvhobAPV7gMC-WL6Cpct5uQTgiRfpsB
    try {
      const discordWebhookPost = {
        content: msg,
        username: DISCORD_BOT_NAME,
        // avatar_url: '' TODO
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
    } catch (e) {
      // TODO: what/where do we want to log?
      console.log('Discord webhook error:', e);
    }
  }

  if (channels?.telegram && telegram_id) {
    // https://api.telegram.org/bot<your-bot-token>/sendMessage?chat_id=<chat-id>&text=TestReply
    try {
      const telegramBotPost = {
        chat_id: 'TODO', // what goes here?
        text: encodeURIComponent(msg),
      };
      const res = await fetch(
        `https://api.telegram.org/bot${telegram_id}/sendMessage`,
        {
          method: 'POST',
          body: JSON.stringify(telegramBotPost),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) {
        throw new Error(JSON.stringify(await res.json()));
      }
    } catch (e) {
      // TODO: what/where do we want to log?
      console.log('Telegram bot error:', e);
    }
  }
}
