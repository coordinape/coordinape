import { useAuthStore, useIsLoggedIn } from 'features/auth';
import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import { useWeb3React } from 'hooks/useWeb3React';

export const getNavData = (profileId: number, chainId: number) =>
  client.query(
    {
      organizations: [
        {
          order_by: [{ name: order_by.asc }],
        },
        {
          id: true,
          name: true,
          logo: true,
          members: [
            { where: { profile_id: { _eq: profileId } } },
            { role: true, hidden: true },
          ],
          __alias: {
            otherCircles: {
              circles: [
                {
                  where: {
                    _not: { users: { profile: { id: { _eq: profileId } } } },
                  },
                  order_by: [{ name: order_by.asc }],
                },
                {
                  id: true,
                  name: true,
                  logo: true,
                },
              ],
            },
            myCircles: {
              circles: [
                {
                  where: {
                    users: { profile: { id: { _eq: profileId } } },
                  },
                  order_by: [{ name: order_by.asc }],
                },
                {
                  id: true,
                  name: true,
                  logo: true,
                  users: [
                    { where: { profile: { id: { _eq: profileId } } } },
                    { role: true, id: true },
                  ],
                },
              ],
            },
          },
        },
      ],
      claims_aggregate: [
        {
          where: {
            profile_id: { _eq: profileId },
            txHash: { _is_null: true },
            distribution: {
              tx_hash: { _is_null: false },
              vault: { chain_id: { _eq: chainId } },
            },
          },
        },
        { aggregate: { count: [{}, true] } },
      ],
      profiles: [
        { limit: 1, where: { id: { _eq: profileId } } },
        {
          name: true,
          id: true,
          avatar: true,
          address: true,
          tos_agreed_at: true,
          cosoul: {
            id: true,
          },
        },
      ],
    },
    { operationName: 'getNavData' }
  );

export const QUERY_KEY_NAV = 'Nav';

// FIXME this is redundant with fetchManifest
export const useNavQuery = () => {
  const { chainId } = useWeb3React();
  const isLoggedIn = useIsLoggedIn();
  const profileId = useAuthStore(state => state.profileId);
  return useQuery(
    [QUERY_KEY_NAV, profileId],
    async () => {
      const data = await getNavData(profileId as number, chainId as number);
      const profile = data.profiles?.[0];
      if (!profile) {
        throw new Error('no profile for current user');
      }
      return { ...data, profile };
    },
    {
      enabled: !!profileId && !!chainId && isLoggedIn,
      staleTime: Infinity,
    }
  );
};

export type NavQuery = Partial<ReturnType<typeof useNavQuery>>;
export type NavQueryData = ReturnType<typeof useNavQuery>['data'];
export type NavOrg = NonNullable<NavQuery['data']>['organizations'][number];
export type NavCircle =
  | NavOrg['myCircles'][number]
  | NavOrg['otherCircles'][number];
