import { VercelRequest } from '@vercel/node';

import { adminClient } from '../../../api-lib/gql/adminClient.ts';
import { NotFoundError } from '../../../api-lib/HttpError.ts';

export const getGive = async (req: VercelRequest) => {
  let id: number | undefined;
  if (typeof req.query.id == 'string') {
    id = parseInt(req.query.id);
  }

  if (!id) {
    throw new NotFoundError('no give ID provided');
  }

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
