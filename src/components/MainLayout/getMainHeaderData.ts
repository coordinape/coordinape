import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';
import { useAccount } from 'wagmi';

import useProfileId from '../../hooks/useProfileId';

export const getMainHeaderData = (profileId: number, chainId: number) =>
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
                { where: { profile_id: { _eq: profileId } } },
                { role: true },
              ],
            },
          ],
        },
      ],
      claims_aggregate: [
        {
          where: {
            profile: { id: { _eq: profileId } },
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
    { operationName: 'getMainHeaderData' }
  );

export const QUERY_KEY_MAIN_HEADER = 'MainHeader';

// extracting this from OverviewMenu because a list of all the orgs the user
// belongs to is handy for multiple purposes, so if we use the same cache key,
// we can reuse it
export const useMainHeaderQuery = () => {
  const profileId = useProfileId();
  const { chainId } = useAccount();
  return useQuery(
    [QUERY_KEY_MAIN_HEADER, profileId],
    () => getMainHeaderData(profileId as number, chainId as number),
    {
      enabled: !!profileId && !!chainId,
      staleTime: Infinity,
    }
  );
};

export type MainHeaderQuery = Partial<ReturnType<typeof useMainHeaderQuery>>;
