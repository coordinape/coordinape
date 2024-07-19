import { useQuery } from 'react-query';

import { anonClient } from '../../lib/anongql/anonClient';

export const QUERY_KEY_PARTY_PROFILE = 'partyProfile';

export const useCoLinksProfile = (address: string) => {
  return useQuery([QUERY_KEY_PARTY_PROFILE, address, 'profile'], () =>
    fetchCoLinksProfile(address)
  );
};

const fetchCoLinksProfile = async (address: string) => {
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
          id: true,
          name: true,
          avatar: true,
          address: true,
          website: true,
          links: true,
          description: true,
          reputation_score: {
            total_score: true,
          },
        },
      ],
    },
    {
      operationName: 'partyProfileContent__fetchCoLinksProfile',
    }
  );
  const profile = profiles_public.pop();

  return profile ? profile : null;
};

export type PublicProfile = NonNullable<
  Required<Awaited<ReturnType<typeof fetchCoLinksProfile>>>
>;
