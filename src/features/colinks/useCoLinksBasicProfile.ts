import { useQuery } from 'react-query';

import { client } from '../../lib/gql/client';

export const useCoLinksBasicProfile = (address?: string) => {
  const { data, isLoading } = useQuery(
    ['colinks', address, 'basic_profile'],
    async () => {
      const { profiles_public } = await client.query(
        {
          profiles_public: [
            {
              where: {
                address: {
                  _ilike: address,
                },
              },
            },
            {
              name: true,
              avatar: true,
              id: true,
            },
          ],
        },
        {
          operationName: 'basic_profile',
        }
      );
      return profiles_public.pop();
    },
    {
      enabled: !!address,
    }
  );
  return { data, isLoading };
};
