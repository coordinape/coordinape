import { useIsLoggedIn } from 'features/auth';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import useConnectedAddress from 'hooks/useConnectedAddress';
import { useWeb3React } from 'hooks/useWeb3React';

export const getMainHeaderData = (address: string, chainId: number) =>
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
              users: [
                { where: { address: { _eq: address.toLowerCase() } } },
                { role: true },
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
        { name: true, id: true },
      ],
    },
    { operationName: 'getMainHeaderData' }
  );

export const QUERY_KEY_MAIN_HEADER = 'MainHeader';

// extracting this from OverviewMenu because a list of all the orgs the user
// belongs to is handy for multiple purposes, so if we use the same cache key,
// we can reuse it
export const useMainHeaderQuery = () => {
  const address = useConnectedAddress();
  const { chainId } = useWeb3React();
  const isLoggedIn = useIsLoggedIn();
  return useQuery(
    [QUERY_KEY_MAIN_HEADER, address],
    () => getMainHeaderData(address as string, chainId as number),
    {
      enabled: !!address && !!chainId && isLoggedIn,
      staleTime: Infinity,
    }
  );
};

export type MainHeaderQuery = Partial<ReturnType<typeof useMainHeaderQuery>>;
