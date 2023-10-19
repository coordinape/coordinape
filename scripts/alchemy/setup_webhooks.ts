/* eslint-disable no-console */
// Script to idempotently (delete then create) webhooks with Alchemy

import assert from 'assert';

import fetch from 'node-fetch';

const api_token = process.env.ALCHEMY_API_TOKEN;
assert(api_token, 'Missing ALCHEMY_API_TOKEN');

const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'X-Alchemy-Token': api_token,
    'content-type': 'application/json',
  },
};

const createWebhook = (name: string, options: any, body: any) => {
  console.log('Creating webhook for', name);
  const opts = {
    ...options,
    body: JSON.stringify(body),
  };
  fetch('https://dashboard.alchemy.com/api/create-webhook', opts)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
};

createWebhook('CoSoul Transfer events', options, {
  network: 'OPT_MAINNET',
  webhook_type: 'GRAPHQL',
  webhook_url: 'https://app.coordinape.com/api/webhooks/alchemy_cosoul',
  graphql_query: {
    skip_empty_messages: true,
    query: `
# Get all Transfer event logs for the CoSoul contract 
{
  block {
    hash
    logs(filter: {addresses: ["0x47c2a56176335fb2b1ded8e7b5acb136d307dc2d"], topics: ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]}) {
      topics
      data
      transaction{
        hash
        index
        to{
          address
        }
        from {
          address
        }
        status
      }
    }
  }
}
`.trim(),
  },
});
