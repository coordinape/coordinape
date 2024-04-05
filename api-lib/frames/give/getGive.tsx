import { adminClient } from '../../gql/adminClient';
import { NotFoundError } from '../../HttpError';

export const getGive = async (id: number): Promise<NonNullGive> => {
  const maybeNullGive = await fetchGive(id);

  if (
    !maybeNullGive ||
    !maybeNullGive.target_profile_public ||
    !maybeNullGive.giver_profile_public
  ) {
    throw new NotFoundError('give not found');
  }

  return maybeNullGive as NonNullGive;
};

const fetchGive = async (id: number) => {
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
            cosoul: {
              id: true,
              token_id: true,
            },
            links_held: true,
            colinks_gives: [{}, { id: true, target_profile_id: true }],
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

// TODO: This is a hack - don't understand why its not easier to get a non-null type
export type Give = NonNullable<Awaited<ReturnType<typeof fetchGive>>>;
export type GiveProfilePublic = NonNullable<Give['giver_profile_public']>;
export type NonNullGive = {
  target_profile_public: GiveProfilePublic;
  giver_profile_public: GiveProfilePublic;
} & Give;
