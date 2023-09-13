import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import { COORDINAPE_USER_ADDRESS } from '../../../../api-lib/config';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import { Role } from '../../../../src/lib/users';

const restoreCoordinapeInput = z.object({ circle_id: z.number() }).strict();

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    payload: { circle_id },
  } = await getInput(req, restoreCoordinapeInput, { allowAdmin: true });

  const {
    users: [existingCoordinape],
    profiles: [coordinapeProfile],
  } = await adminClient.query(
    {
      users: [
        {
          limit: 1,
          where: { role: { _eq: 2 }, circle_id: { _eq: circle_id } },
        },
        { id: true, deleted_at: true },
      ],
      profiles: [
        {
          limit: 1,
          where: { address: { _eq: COORDINAPE_USER_ADDRESS.toLowerCase() } },
        },
        { id: true },
      ],
    },
    { operationName: 'deleteUser_getExistingUser' }
  );

  if (existingCoordinape && !existingCoordinape.deleted_at) {
    return errorResponseWithStatusCode(
      res,
      { message: 'user is not deleted' },
      422
    );
  }

  if (!existingCoordinape) {
    await adminClient.mutate(
      {
        insert_users_one: [
          {
            object: {
              circle_id,
              name: 'Coordinape',
              address: COORDINAPE_USER_ADDRESS,
              profile_id: coordinapeProfile.id,
              role: Role.COORDINAPE,
              non_receiver: false,
              fixed_non_receiver: false,
              starting_tokens: 0,
              non_giver: true,
              give_token_remaining: 0,
              bio: "At this time we've chosen to forgo charging fees for Coordinape and instead we're experimenting with funding our DAO through donations. As part of this experiment, Coordinape will optionally become part of everyone's circles as a participant. If you don't agree with this model or for any other reason don't want Coordinape in your circle, you can disable it in Circle Settings.",
            },
          },
          { __typename: true },
        ],
      },
      { operationName: 'restore_coordinape_insert' }
    );

    return res.status(200).json({ success: true });
  }

  await adminClient.mutate(
    {
      update_users_by_pk: [
        {
          pk_columns: { id: existingCoordinape.id },
          _set: { deleted_at: null },
        },
        { __typename: true },
      ],
    },
    { operationName: 'restore_coordinape_update' }
  );

  res.status(200).json({ success: true });
}

export default authCircleAdminMiddleware(handler);
