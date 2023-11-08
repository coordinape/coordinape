/* eslint-disable no-console */
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { private_stream_visibility_constraint } from '../gql/__generated__/zeus';
import { adminClient } from '../gql/adminClient';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const payload: EventTriggerPayload<'mutes', 'INSERT' | 'DELETE'> = req.body;

    if (payload.event.data.old && !payload.event.data.new) {
      const { profile_id, target_profile_id } = payload.event.data.old;
      // deleted
      // wow no longer muted, so we need to see if they are link holders and re-establish their connection
      // if profile no longer mutes target, it would be ok now for profile to see target if they are linked
      const linked = await isLinked(profile_id, target_profile_id);
      if (linked) {
        // ok they are linked so insert visibility allowing profileId to see targetProfileId
        await addVisibility(profile_id, target_profile_id);
      }
    } else if (payload.event.data.new && !payload.event.data.old) {
      const { profile_id, target_profile_id } = payload.event.data.new;
      // inserted
      // this is easy - delete visibility of target_profile_id from profile_id
      await deleteVisibility(profile_id, target_profile_id);
    } else {
      console.log('whoa this isnt insert or delete');
      res.status(400).json({
        error: '400',
        message: 'unexpected: not insert or delete',
      });
    }

    res.status(200).json({ message: 'ok' });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: '500',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}

async function isLinked(profileIdA: number, profileIdB: number) {
  const { link_holders } = await adminClient.query(
    {
      link_holders: [
        {
          where: {
            _or: [
              {
                holder_cosoul: { profile: { id: { _eq: profileIdA } } },
                target_cosoul: { profile: { id: { _eq: profileIdB } } },
              },
              {
                holder_cosoul: { profile: { id: { _eq: profileIdB } } },
                target_cosoul: { profile: { id: { _eq: profileIdA } } },
              },
            ],
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'isLinked',
    }
  );
  return link_holders.length > 0;
}

async function addVisibility(profile_id: number, target_profile_id: number) {
  await adminClient.mutate(
    {
      insert_private_stream_visibility_one: [
        {
          object: {
            profile_id,
            view_profile_id: target_profile_id,
          },
          on_conflict: {
            constraint:
              private_stream_visibility_constraint.private_stream_visibility_pkey,
            update_columns: [],
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'addVisibility',
    }
  );
}

async function deleteVisibility(profile_id: number, target_profile_id: number) {
  await adminClient.mutate(
    {
      delete_private_stream_visibility_by_pk: [
        {
          profile_id,
          view_profile_id: target_profile_id,
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'deleteVisibility',
    }
  );
}
