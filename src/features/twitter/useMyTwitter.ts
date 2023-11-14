import { useQuery } from 'react-query';

import { client } from '../../lib/gql/client';

export const useMyTwitter = (profileId?: number) => {
  const { data, isLoading } = useQuery(
    ['twitter', 'me', profileId],
    async () => {
      const { twitter_accounts_by_pk } = await client.query(
        {
          twitter_accounts_by_pk: [
            {
              profile_id: profileId ?? -1,
            },
            {
              username: true,
              name: true,
              profile_image_url: true,
            },
          ],
        },
        {
          operationName: 'twitter_me',
        }
      );

      return twitter_accounts_by_pk;
    },
    {
      enabled: !!profileId,
    }
  );
  return { twitter: data, isLoading };
};
