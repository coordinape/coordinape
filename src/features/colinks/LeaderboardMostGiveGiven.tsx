import { useQuery } from 'react-query';

import useConnectedAddress from '../../hooks/useConnectedAddress';
import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { coLinksMemberSelector } from '../../pages/colinks/explore/CoLinksMember';

import { Leaderboard } from './Leaderboard';
import { QUERY_KEY_COLINKS } from './wizard/CoLinksWizard';

export const LeaderboardMostGiveGiven = ({
  limit = 100,
}: {
  limit?: number;
}) => {
  const currentAddress = useConnectedAddress(true);
  const { data: leaders } = useQuery(
    [QUERY_KEY_COLINKS, 'leaderboard', 'most_give_given'],
    async () => {
      const { most_give_given } = await client.query(
        {
          __alias: {
            most_give_given: {
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
          operationName: 'coLinks_leaderboard_mostGive @cached(ttl: 30)',
        }
      );
      return most_give_given;
    }
  );
  return <Leaderboard leaders={leaders} />;
};
