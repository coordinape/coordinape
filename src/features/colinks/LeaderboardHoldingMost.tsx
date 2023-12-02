import { useQuery } from 'react-query';

import useConnectedAddress from '../../hooks/useConnectedAddress';
import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { coLinksMemberSelector } from '../../pages/colinks/explore/CoLinksMember';

import { Leaderboard } from './Leaderboard';
import { QUERY_KEY_COLINKS } from './wizard/CoLinksWizard';

export const LeaderboardHoldingMost = ({ limit = 100 }: { limit?: number }) => {
  const currentAddress = useConnectedAddress(true);
  const { data: leaders } = useQuery(
    [QUERY_KEY_COLINKS, 'leaderboard', 'holding'],
    async () => {
      const { holding_most } = await client.query(
        {
          __alias: {
            holding_most: {
              profiles_public: [
                {
                  where: {
                    cosoul: {},
                  },
                  order_by: [
                    { links_held: order_by.desc, name: order_by.desc },
                  ],
                  limit: limit,
                },
                coLinksMemberSelector(currentAddress),
              ],
            },
          },
        },
        {
          operationName: 'coLinks_leaderboard',
        }
      );
      return holding_most;
    }
  );
  return <Leaderboard leaders={leaders} />;
};
