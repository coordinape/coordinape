import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';

import useConnectedAddress from '../../hooks/useConnectedAddress';
import { order_by } from '../../lib/anongql/__generated__/zeus';
import { coLinksMemberSelector } from '../../pages/colinks/explore/CoLinksMember';

import { Leaderboard } from './Leaderboard';
import { QUERY_KEY_COLINKS } from './wizard/CoLinksWizard';

export const LeaderboardRepScore = ({ limit = 100 }: { limit?: number }) => {
  const currentAddress = useConnectedAddress(false);
  const { data: leaders } = useQuery(
    [QUERY_KEY_COLINKS, 'anonLeaderboard', 'respcore'],
    async () => {
      const { highest_rep } = await anonClient.query(
        {
          __alias: {
            highest_rep: {
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
                      reputation_score: { total_score: order_by.desc },
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
          operationName: 'coLinks_leaderboard_repScore',
        }
      );
      return highest_rep;
    }
  );
  return <Leaderboard leaders={leaders} />;
};
