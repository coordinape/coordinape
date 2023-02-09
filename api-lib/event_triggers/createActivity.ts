import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../gql/adminClient';
import { insertActivity } from '../gql/mutations';
import { errorResponse } from '../HttpError';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const getHelperData = async (user_id: number, circle_id: number) => {
    const data = await adminClient.query(
      {
        circles_by_pk: [
          { id: circle_id },
          {
            id: true,
            organization_id: true,
            users: [
              { where: { id: { _eq: user_id } } },
              {
                profile: { id: true },
              },
            ],
          },
        ],
      },
      {
        operationName: 'getOrgByCircle',
      }
    );

    return data.circles_by_pk;
  };

  try {
    const {
      event: {
        op: operation,
        data: {
          new: { id, user_id, circle_id, created_at },
        },
      },
      table: { name: table_name },
    }: EventTriggerPayload<'contributions', 'INSERT'> = req.body;

    const data = await getHelperData(user_id, circle_id);

    switch (table_name) {
      case 'contributions': {
        await insertActivity({
          contribution_id: id,
          action: `${table_name}_${operation.toLowerCase()}`,
          actor_profile_id: data?.users[0].profile.id,
          circle_id: circle_id,
          organization_id: data?.organization_id,
          created_at: created_at,
        });
        break;
      }
      default: {
        throw 'unknown table name for activity';
      }
    }

    res.status(200).json({
      message: `activity recorded`,
    });
  } catch (e) {
    return errorResponse(res, e);
  }
}
