import { ComponentProps } from 'react';

import { useQuery } from 'react-query';

import useConnectedAddress from '../../hooks/useConnectedAddress';
import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import {
  CoLinksMember,
  coLinksMemberSelector,
} from '../../pages/colinks/explore/CoLinksMember';

import { Leaderboard } from './Leaderboard';
import { QUERY_KEY_COLINKS } from './wizard/CoLinksWizard';

export const LeaderboardMostLinks = ({
  limit = 100,
  size = 'large',
  hideRank = false,
}: {
  limit?: number;
  hideRank?: boolean;
  size?: ComponentProps<typeof CoLinksMember>['size'];
}) => {
  const currentAddress = useConnectedAddress(true);
  const { data: leaders } = useQuery(
    [QUERY_KEY_COLINKS, 'leaderboard', 'holders'],
    async () => {
      const { most_links } = await client.query(
        {
          __alias: {
            most_links: {
              profiles_public: [
                {
                  where: {
                    cosoul: {},
                  },
                  order_by: [{ links: order_by.desc, name: order_by.desc }],
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
      return most_links;
    }
  );
  return <Leaderboard leaders={leaders} size={size} hideRank={hideRank} />;
};
