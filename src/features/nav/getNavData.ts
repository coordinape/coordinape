import { useAuthStore, useIsLoggedIn } from 'features/auth';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import { useWeb3React } from 'hooks/useWeb3React';

export const getNavData = (profileId: number, chainId: number) =>
  client.query(
    {
      organizations: [
        {},
        {
          id: true,
          name: true,
          logo: true,
          circles: [
            {},
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
          members: [
            { where: { profile_id: { _eq: profileId } } },
            { role: true },
          ],
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
        { name: true, id: true, avatar: true },
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
export type NavOrg = NonNullable<NavQuery['data']>['organizations'][number];
export type NavCircle = NavOrg['circles'][number];
