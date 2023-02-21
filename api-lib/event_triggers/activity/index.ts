import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../gql/adminClient';
import { errorResponse } from '../../HttpError';
import { EventTriggerPayload } from '../../types';

import { insertActivity } from './mutations';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  type Events =
    | EventTriggerPayload<'contributions', 'INSERT'>
    | EventTriggerPayload<'epochs', 'INSERT'>
    | EventTriggerPayload<'users', 'INSERT'>;

  try {
    const {
      table: { name: table_name },
    }: Events = req.body;

    switch (table_name) {
      case 'contributions': {
        const {
          event: {
            op: operation,
            data: {
              new: { id, user_id, circle_id, created_at },
            },
          },
        }: EventTriggerPayload<'contributions', 'INSERT'> = req.body;

        const data = await getOrgAndProfile(user_id, circle_id);

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
      case 'epoches': {
        const {
          event: {
            op: operation,
            data: {
              new: { id, circle_id, created_at },
            },
          },
        }: EventTriggerPayload<'epochs', 'INSERT'> = req.body;

        const data = await getOrgByEpoch(id);

        await insertActivity({
          epoch_id: id,
          action: `${table_name}_${operation.toLowerCase()}`,
          circle_id: circle_id,
          created_at: created_at,
          organization_id: data?.circle?.organization.id,
        });
        break;
      }
      case 'users': {
        const {
          event: {
            op: operation,
            data: {
              new: { id, circle_id, created_at },
            },
          },
        }: EventTriggerPayload<'users', 'INSERT'> = req.body;

        const data = await getOrgAndProfile(id, circle_id);

        await insertActivity({
          action: `${table_name}_${operation.toLowerCase()}`,
          circle_id: circle_id,
          created_at: created_at,
          organization_id: data?.organization_id,
          target_profile_id: data?.users[0].profile.id,
          user_id: id,
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

async function getOrgAndProfile(user_id: number, circle_id: number) {
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
}

async function getOrgByEpoch(epoch_id: number) {
  const data = await adminClient.query(
    {
      epochs_by_pk: [
        { id: epoch_id },
        {
          circle: {
            organization: { id: true },
          },
        },
      ],
    },
    {
      operationName: 'getOrgByEpoch',
    }
  );

  return data.epochs_by_pk;
}
