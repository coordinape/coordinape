import { useAuthStore, useIsLoggedIn } from 'features/auth';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import { useWeb3React } from 'hooks/useWeb3React';

export const getProfileData = (profileId: number) =>
  client.query(
    {
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
    { operationName: 'getProfileData' }
  );

export const QUERY_KEY_PROFILE = 'Profile';

// FIXME this is redundant with fetchManifest
export const useProfileQuery = () => {
  const { chainId } = useWeb3React();
  const isLoggedIn = useIsLoggedIn();
  const profileId = useAuthStore(state => state.profileId);
  return useQuery(
    [QUERY_KEY_PROFILE, profileId],
    async () => {
      const data = await getProfileData(profileId as number);
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

export type ProfileQuery = Partial<ReturnType<typeof useProfileQuery>>;
