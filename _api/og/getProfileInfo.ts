import { adminClient } from '../../api-lib/gql/adminClient.ts';

export const getProfileInfo = async (address: string) => {
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            address: {
              _ilike: address,
            },
          },
        },
        {
          reputation_score: {
            total_score: true,
          },
          links: true,
          name: true,
          avatar: true,
          description: true,
        },
      ],
    },
    {
      operationName: 'profileInfoForOgTags',
    }
  );
  return profiles.pop();
};
