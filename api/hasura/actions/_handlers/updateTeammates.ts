import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { getUsersFromUserIds } from '../../../../api-lib/findUser';
import { teammates_constraint } from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import { getUserFromProfileIdWithCircle } from '../../../../api-lib/nominees';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';

const updateTeammatesInput = z
  .object({
    teammates: z.number().int().positive().array(),
    circle_id: z.number().int().positive(),
  })
  .strict();

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    payload: { circle_id, teammates },
    session: { hasuraProfileId: profileId },
  } = await getInput(req, updateTeammatesInput);

  // check if user is from the same circle
  const user = await getUserFromProfileIdWithCircle(profileId, circle_id);
  if (!user) {
    return errorResponseWithStatusCode(
      res,
      { message: 'User does not belong to this circle' },
      422
    );
  }
  const teammatesUsers = await getUsersFromUserIds(teammates, circle_id);
  const teammatesToKeep = teammatesUsers
    .filter(t => t.id !== user.id)
    .map(t => t.id);
  const insertInput = teammatesToKeep.map(t => {
    return { user_id: user.id, team_mate_id: t };
  });
  await adminClient.mutate(
    {
      delete_teammates: [
        {
          where: {
            user_id: { _eq: user.id },
            team_mate_id: { _nin: teammatesToKeep },
          },
        },
        { affected_rows: true },
      ],
      insert_teammates: [
        {
          objects: insertInput,
          on_conflict: {
            constraint: teammates_constraint.teammates_user_id_team_mate_id_key,
            update_columns: [],
          },
        },
        { returning: { user_id: true } },
      ],
    },
    { operationName: 'updateTeammates_deleteAndInsert' }
  );

  return res.status(200).json({ user_id: user.id });
}

export default verifyHasuraRequestMiddleware(handler);
