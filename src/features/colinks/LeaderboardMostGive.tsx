import { useQuery } from 'react-query';

import useConnectedAddress from '../../hooks/useConnectedAddress';
import { order_by } from '../../lib/anongql/__generated__/zeus';
import { anonClient } from '../../lib/anongql/anonClient';
import { coLinksMemberSelector } from '../../pages/colinks/explore/CoLinksMember';

import { Leaderboard } from './Leaderboard';
import { QUERY_KEY_COLINKS } from './wizard/CoLinksWizard';

export const LeaderboardMostGive = ({ limit = 100 }: { limit?: number }) => {
  const currentAddress = useConnectedAddress(false);
  const { data: leaders } = useQuery(
    [QUERY_KEY_COLINKS, 'leaderboard', 'most_give'],
    async () => {
      const { most_give } = await anonClient.query(
        {
          __alias: {
            most_give: {
              profiles_public: [
                {
                  where: {
                    cosoul: {},
                    links_held: {
                      _gt: 0,
                    },
                  },
                  order_by: [
                    {
                      colinks_gives_aggregate: {
                        count: order_by.desc_nulls_last,
                      },
                      name: order_by.desc,
                    },
                  ],
                  limit: limit,
                },
                coLinksMemberSelector(currentAddress),
              ],
            },
          },
        },
        {
          operationName: 'coLinks_giveHome_topReceivers @cached(ttl: 60)',
        }
      );
      return most_give;
    }
  );
  return <Leaderboard leaders={leaders} />;
};
