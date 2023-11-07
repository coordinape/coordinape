import { adminClient } from '../../../../api-lib/gql/adminClient';

import { KEY_HOLDER_VALUE, KEY_HOLDING_VALUE, KEYS_SCORE_MAX } from './scoring';

export const getLinksScore = async (address: string) => {
  const { my_holders, my_holdings } = await adminClient.query(
    {
      __alias: {
        my_holders: {
          link_holders_aggregate: [
            {
              where: {
                target: {
                  _eq: address,
                },
              },
            },
            {
              aggregate: {
                sum: {
                  amount: true,
                },
              },
            },
          ],
        },
        my_holdings: {
          link_holders_aggregate: [
            {
              where: {
                holder: {
                  _eq: address,
                },
              },
            },
            {
              aggregate: {
                sum: {
                  amount: true,
                },
              },
            },
          ],
        },
      },
    },
    {
      operationName: 'getKeysScore',
    }
  );

  const myHoldings = my_holdings.aggregate?.sum?.amount ?? 0;
  const myHolders = my_holders.aggregate?.sum?.amount ?? 0;

  const keyHolderScore = myHolders * KEY_HOLDER_VALUE;
  const keyHoldingScore = myHoldings * KEY_HOLDING_VALUE;

  return Math.floor(Math.min(KEYS_SCORE_MAX, keyHolderScore + keyHoldingScore));
};
