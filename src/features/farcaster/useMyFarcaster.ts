import { useQuery } from 'react-query';

import { client } from '../../lib/gql/client';

export const useMyFarcaster = (profileId?: number) => {
  const { data, isLoading } = useQuery(
    ['farcaster', 'me', profileId],
    async () => {
      const { farcaster_accounts_by_pk } = await client.query(
        {
          farcaster_accounts_by_pk: [
            {
              profile_id: profileId ?? -1,
            },
            {
              username: true,
              name: true,
              fid: true,
              pfp_url: true,
              custody_address: true,
              bio_text: true,
            },
          ],
        },
        {
          operationName: 'farcaster_me',
        }
      );

      return farcaster_accounts_by_pk;
    },
    {
      enabled: !!profileId,
    }
  );
  return { farcaster: data, isLoading };
};
