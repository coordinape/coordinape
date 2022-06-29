import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import { useAuthStep } from 'hooks/login';
import useConnectedAddress from 'hooks/useConnectedAddress';

export const getOverviewMenuData = (address: string) =>
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
    },
    {
      operationName: 'getOverviewMenuData',
    }
  );

// extracting this from OverviewMenu because a list of all the orgs the user
// belongs to is handy for multiple purposes, so if we use the same cache key,
// we can reuse it
export const useOverviewMenuQuery = () => {
  const address = useConnectedAddress();
  const [authStep] = useAuthStep();
  return useQuery(
    ['OverviewMenu', address],
    () => getOverviewMenuData(address as string),
    {
      enabled: !!address && authStep === 'done',
      staleTime: Infinity,
    }
  );
};
