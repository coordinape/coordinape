/* eslint-disable no-console */
import assert from 'assert';

const api_token = process.env.NEYNAR_API_KEY;
assert(api_token, 'Missing NEYNAR_API_KEY');

const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    api_key: api_token,
    'content-type': 'application/json',
  },
};

const createWebhook = (name: string, options: any, body: any) => {
  console.log('Creating webhook for', name);
  const opts = {
    ...options,
    body: JSON.stringify(body),
  };
  fetch('https://api.neynar.com/v2/farcaster/webhook', opts)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
};

createWebhook('Webhook - mentions of FID', options, {
  subscription: {
    'cast.created': {
      mentioned_fids: [244292],
    },
  },
  name: 'mentions of fid 244292 @crabsinger.eth',
  url: 'https://9171-149-36-48-137.ngrok-free.app/api/webhooks/neynar_mention',
});
