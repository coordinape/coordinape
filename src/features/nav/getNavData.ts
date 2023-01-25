import { useIsLoggedIn } from 'features/auth';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import { useConnectedAddress } from 'hooks/useConnectedAddress';
import { useWeb3React } from 'hooks/useWeb3React';

export const getNavData = (address: string, chainId: number) =>
  client.query(
    {
      organizations: [
        {},
        {
          id: true,
          name: true,
          logo: true,
          circles: [
            {
              where: {
                users: {
                  address: { _eq: address.toLowerCase() },
                  deleted_at: { _is_null: true },
                },
              },
            },
            {
              id: true,
              name: true,
              logo: true,
              users: [
                { where: { address: { _eq: address.toLowerCase() } } },
                { role: true, id: true },
              ],
            },
          ],
        },
      ],
      claims_aggregate: [
        {
          where: {
            profile: { address: { _eq: address.toLowerCase() } },
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
        { limit: 1, where: { address: { _eq: address.toLowerCase() } } },
        { name: true, id: true, avatar: true },
      ],
    },
    { operationName: 'getNavData' }
  );

export const QUERY_KEY_NAV = 'Nav';

export const useNavQuery = () => {
  const address = useConnectedAddress();
  const { chainId } = useWeb3React();
  const isLoggedIn = useIsLoggedIn();
  return useQuery(
    [QUERY_KEY_NAV, address],
    async () => {
      const data = await getNavData(address as string, chainId as number);
      const profile = data.profiles?.[0];
      if (!profile) {
        throw new Error('no profile for current user');
      }
      return {
        ...data,
        profile,
      };
    },
    {
      enabled: !!address && !!chainId && isLoggedIn,
      staleTime: Infinity,
    }
  );
};

export type NavQuery = Partial<ReturnType<typeof useNavQuery>>;
export type NavOrg = NonNullable<NavQuery['data']>['organizations'][number];
export type NavCircle = NavOrg['circles'][number];
