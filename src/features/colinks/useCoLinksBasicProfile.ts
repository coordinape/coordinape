import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';

export const useCoLinksBasicProfile = (address?: string) => {
  const { data, isLoading } = useQuery(
    ['colinks', address, 'basic_profile'],
    async () => {
      const { profiles_public } = await anonClient.query(
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
