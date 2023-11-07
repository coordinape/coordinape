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

// createWebhook('OPT_GOERLI - CoSoul Transfer events', options, {
//   network: 'OPT_GOERLI',
//   webhook_type: 'GRAPHQL',
//   webhook_url:
//     'https://coordinape-git-staging-coordinape.vercel.app/api/webhooks/alchemy_cosoul',
//   graphql_query: {
//     skip_empty_messages: true,
//     query: `
// # Get all Transfer event logs for the CoSoul contract
// {
//   block {
//     hash
//     logs(filter: {addresses: ["0xCf0A11f5a4224891F8F719f2b3BCc77aF3084014"], topics: ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]}) {
//       topics
//       data
//       transaction{
//         hash
//         index
//         to{
//           address
//         }
//         from {
//           address
//         }
//         status
//       }
//     }
//   }
// }
// `.trim(),
//   },
// });
// createWebhook('OPT_MAINNET - CoSoul Transfer events', options, {
//   network: 'OPT_MAINNET',
//   webhook_type: 'GRAPHQL',
//   webhook_url: 'https://app.coordinape.com/api/webhooks/alchemy_cosoul',
//   graphql_query: {
//     skip_empty_messages: true,
//     query: `
// # Get all Transfer event logs for the CoSoul contract
// {
// block {
// hash
// logs(filter: {addresses: ["0x47c2a56176335fb2b1ded8e7b5acb136d307dc2d"], topics: ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]}) {
// topics
// data
// transaction{
// hash
// index
// to{
// address
// }
// from {
// address
// }
// status
// }
// }
// }
// }
// `.trim(),
//   },
// });

createWebhook('CoLinks Trade events', options, {
  network: 'OPT_GOERLI',
  webhook_type: 'GRAPHQL',
  webhook_url:
    'https://coordinape-git-staging-coordinape.vercel.app/api/webhooks/alchemy_key_trade',
  graphql_query: {
    skip_empty_messages: true,
    // TODO: this is the wrong contract address right?
    query: `
# Get all Trade event logs for the CoLinks contract 
{
  block {
    hash
    logs(filter: {addresses: ["0xbB57FE325e769DEDB1236525a91cDEd842143fA7"], topics: ["0x2c76e7a47fd53e2854856ac3f0a5f3ee40d15cfaa82266357ea9779c486ab9c3"]}) {
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
