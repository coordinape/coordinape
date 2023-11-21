/* eslint-disable no-console */
// TODO: Make script idempotent (delete then create) webhooks with Alchemy

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

createWebhook('CoLinks Link Tx events', options, {
  network: 'OPT_GOERLI',
  webhook_type: 'GRAPHQL',
  webhook_url:
    'https://coordinape-git-staging-coordinape.vercel.app/api/webhooks/alchemy_link_tx',
  graphql_query: {
    skip_empty_messages: true,
    // TODO: this is the wrong contract address right?
    query: `
# Get all Trade event logs for the CoLinks contract 
{
  block {
    hash
    logs(filter: {addresses: ["0xb04dea2f33730833435f2cb170a340cee369b03c"], topics: ["0xad9f55a41a915706e0b499306a3aabd261f9a4ba53f5a1d36981d40083063a52"]}) {
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
