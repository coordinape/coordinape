import { adminClient } from '../../../../../api-lib/gql/adminClient';

export const getGive = async (id: number) => {
  const { colinks_gives_by_pk: give } = await adminClient.query(
    {
      colinks_gives_by_pk: [
        {
          id,
        },
        {
          id: true,
          profile_id: true,
          target_profile_id: true,
          giver_profile_public: {
            name: true,
            avatar: true,
            id: true,
          },
          target_profile_public: {
            name: true,
            avatar: true,
            id: true,
          },
        },
      ],
    },
    {
      operationName: 'frame_give_getGive',
    }
  );

  return give;
};

export type Give = NonNullable<Awaited<ReturnType<typeof getGive>>>;
