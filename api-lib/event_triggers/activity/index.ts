import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../gql/adminClient';
import { errorResponse } from '../../HttpError';
import { EventTriggerPayload } from '../../types';

import { insertActivity } from './mutations';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  type Events =
    | EventTriggerPayload<'contributions', 'INSERT'>
    | EventTriggerPayload<'epochs', 'INSERT'>
    | EventTriggerPayload<'users', 'INSERT'>
    | EventTriggerPayload<'enriched_casts', 'INSERT'>;

  try {
    const {
      table: { name: table_name },
    }: Events = req.body;

    switch (table_name) {
      case 'enriched_casts': {
        await handleCast(req);
        break;
      }
      case 'contributions': {
        const {
          event: {
            data: {
              new: {
                id,
                user_id,
                circle_id,
                created_at,
                private_stream,
                profile_id,
                big_question_id,
              },
            },
          },
        }: EventTriggerPayload<'contributions', 'INSERT'> = req.body;

        const data = circle_id
          ? await getOrgAndProfile(user_id, circle_id)
          : undefined;

        await insertContributionActivity({
          contribution_id: id,
          actor_profile_id: profile_id,
          circle_id: circle_id,
          organization_id: data?.organization_id,
          created_at: created_at,
          private_stream: private_stream,
          big_question_id: big_question_id,
        });
        break;
      }
      case 'epoches':
      case 'epochs': {
        const {
          event: {
            data: {
              new: { id, circle_id, created_at, created_by },
            },
          },
        }: EventTriggerPayload<'epochs', 'INSERT'> = req.body;

        const data = await getOrgByEpoch(id);

        await insertNewEpochActivity({
          epoch_id: id,
          circle_id: circle_id,
          created_at: created_at,
          actor_profile_id: created_by,
          organization_id: data?.circle?.organization.id,
        });
        break;
      }
      case 'users': {
        const {
          event: {
            data: {
              new: { id, circle_id, created_at },
            },
          },
        }: EventTriggerPayload<'users', 'INSERT'> = req.body;

        const data = await getOrgAndProfile(id, circle_id);

        await insertNewUserActivity({
          circle_id: circle_id,
          created_at: created_at,
          organization_id: data?.organization_id,
          target_profile_id: data?.users[0].profile.id,
          user_id: id,
        });
        break;
      }
      default: {
        throw `unknown table name for activity ${table_name}`;
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

export type ContributionActivityInput = Required<
  Pick<
    Parameters<typeof insertActivity>[0],
    | 'contribution_id'
    | 'actor_profile_id'
    | 'circle_id'
    | 'organization_id'
    | 'created_at'
    | 'private_stream'
    | 'big_question_id'
  >
> & { circle_id?: any; organization_id?: any };

export type CastActivityInput = Required<
  Pick<
    Parameters<typeof insertActivity>[0],
    'cast_id' | 'actor_profile_id' | 'created_at'
  >
>;

export async function insertContributionActivity(
  input: ContributionActivityInput
) {
  await insertActivity({ action: 'contributions_insert', ...input });
}

export async function insertCastActivity(input: CastActivityInput) {
  await insertActivity({ action: 'enriched_casts_insert', ...input });
}

export type NewUserActivityInput = Required<
  Pick<
    Parameters<typeof insertActivity>[0],
    | 'circle_id'
    | 'created_at'
    | 'organization_id'
    | 'target_profile_id'
    | 'user_id'
  >
>;

export async function insertNewUserActivity(input: NewUserActivityInput) {
  await insertActivity({ action: 'users_insert', ...input });
}

export type NewEpochActivityInput = Required<
  Pick<
    Parameters<typeof insertActivity>[0],
    | 'circle_id'
    | 'created_at'
    | 'organization_id'
    | 'actor_profile_id'
    | 'epoch_id'
  >
>;

export async function insertNewEpochActivity(input: NewEpochActivityInput) {
  await insertActivity({ action: 'epochs_insert', ...input });
}

async function handleCast(req: VercelRequest) {
  const {
    event: {
      data: {
        new: { id, created_at, fid, deleted_at },
      },
    },
  }: EventTriggerPayload<'enriched_casts', 'INSERT'> = req.body;

  if (deleted_at) {
    // no need to store casts that are already deleted
    return;
  }

  const { farcaster_accounts } = await adminClient.query(
    {
      farcaster_accounts: [
        {
          where: {
            fid: { _eq: fid },
          },
        },
        {
          profile_id: true,
        },
      ],
    },
    {
      operationName: 'handleActivity__checkIfCastIsFromExistingProfile',
    }
  );

  if (farcaster_accounts.length === 0) {
    // this isn't a user w/ a profile
    return;
  }

  const profile_id = farcaster_accounts[0].profile_id;

  await insertCastActivity({
    cast_id: id,
    actor_profile_id: profile_id,
    created_at: created_at,
  });
  return;
}
