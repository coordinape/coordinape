import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../gql/adminClient';
import { errorResponse } from '../HttpError';
import { EventTriggerPayload } from '../types';

import { getHolderProfileId } from './linkTxInteractionEvent';

async function insertLinkTxNotification(
  actorProfileId: number,
  profileId: number,
  tx_hash: string,
  created_at: string
) {
  await adminClient.mutate(
    {
      insert_notifications_one: [
        {
          object: {
            actor_profile_id: actorProfileId,
            profile_id: profileId,
            link_tx_hash: tx_hash,
            created_at: created_at,
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'insert__linkTxNotification',
    }
  );
}

async function insertInviteJoinedNotification(
  inviteeId: number,
  inviterId: number,
  profileId: number,
  created_at: string
) {
  await adminClient.mutate(
    {
      insert_notifications_one: [
        {
          object: {
            actor_profile_id: inviterId,
            profile_id: profileId,
            invite_joined_id: inviteeId,
            created_at: created_at,
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'insert__inviteeNotification',
    }
  );
}

async function getInvitedBy(profileId: number) {
  const { profiles_by_pk } = await adminClient.query(
    {
      profiles_by_pk: [
        {
          id: profileId,
        },
        {
          invited_by: true,
        },
      ],
    },
    {
      operationName: 'getProfileForFirstTimeLinker',
    }
  );
  return profiles_by_pk?.invited_by;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      event: {
        data: {
          new: { created_at, target, holder, tx_hash },
        },
      },
    }: EventTriggerPayload<'link_tx', 'INSERT'> = req.body;

    // get the profileid from the address
    const actorProfileId = await getHolderProfileId(holder);
    const profileId = await getHolderProfileId(target);

    if (!profileId || !actorProfileId) {
      // this user doesn't use the app
      return res.status(200).json({
        message: `the user with address ${target} doesn't have a profile`,
      });
    }
    if (profileId === actorProfileId) {
      // This is a first timer! See if it was an invite!
      const invitedBy = await getInvitedBy(profileId);
      if (invitedBy) {
        await insertInviteJoinedNotification(
          profileId,
          invitedBy,
          profileId,
          created_at
        );
        await insertInviteJoinedNotification(
          profileId,
          invitedBy,
          invitedBy,
          created_at
        );
        return res.status(200).json({
          message: `saved invite joined notification`,
        });
      }
      return res.status(200).json({
        message: `no notification for your own buys`,
      });
    }

    await insertLinkTxNotification(
      actorProfileId,
      profileId,
      tx_hash,
      created_at
    );

    res.status(200).json({
      message: `link_tx notification recorded`,
    });
  } catch (e) {
    return errorResponse(res, e);
  }
}
