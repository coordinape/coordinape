/* eslint-disable no-console */
import { ComponentProps, useEffect } from 'react';

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

export const LeaderboardProfileResults = ({
  limit = 100,
  size = 'large',
  hideRank = false,
  whereName,
}: {
  whereName: string;
  limit?: number;
  hideRank?: boolean;
  size?: ComponentProps<typeof CoLinksMember>['size'];
}) => {
  useEffect(() => {
    console.log({ leaders });
  });

  const currentAddress = useConnectedAddress(true);
  const { data: leaders } = useQuery(
    [QUERY_KEY_COLINKS, 'leaderboard', 'holders'],
    async () => {
      const { profiles_matching } = await client.query(
        {
          __alias: {
            profiles_matching: {
              profiles_public: [
                {
                  where: {
                    name: {
                      _ilike: `%${whereName}`,
                    },
                    // TODO: make into resuable selector
                    cosoul: {},
                    links_held: {
                      _gt: 0,
                    },
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
      return profiles_matching;
    }
  );
  return <Leaderboard leaders={leaders} size={size} hideRank={hideRank} />;
};
