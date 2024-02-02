import { useQuery } from 'react-query';

import useConnectedAddress from '../../hooks/useConnectedAddress';
import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { coLinksMemberSelector } from '../../pages/colinks/explore/CoLinksMember';

import { Leaderboard } from './Leaderboard';
import { QUERY_KEY_COLINKS } from './wizard/CoLinksWizard';

export const LeaderboardNewest = ({ limit = 100 }: { limit?: number }) => {
  const currentAddress = useConnectedAddress(true);
  const { data: leaders } = useQuery(
    [QUERY_KEY_COLINKS, 'leaderboard', 'newest'],
    async () => {
      const { newest } = await client.query(
        {
          __alias: {
            newest: {
              profiles_public: [
                {
                  where: {
                    cosoul: {},
                    links_held: {
                      _gt: 0,
                    },
                  },
                  order_by: [{ joined_colinks_at: order_by.desc }],
                  limit: limit,
                },
                coLinksMemberSelector(currentAddress),
              ],
            },
          },
        },
        {
          operationName: 'coLinks_leaderboard_newest',
        }
      );
      return newest;
    }
  );
  return <Leaderboard leaders={leaders} />;
};
