import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { gql } from '../../../api-lib/Gql';
import { EventTriggerPayload } from '../../../api-lib/types';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    event: { data },
  }: EventTriggerPayload<'nominees', 'INSERT'> = req.body;

  const { name, address, circle_id, vouches_required, id } = data.new;
  try {
    const { nominees_by_pk } = await gql.getNominee(id);
    assert(nominees_by_pk);
    const vouches =
      (nominees_by_pk.nominations_aggregate?.aggregate?.count ?? 0) + 1;
    if (vouches >= vouches_required) {
      const { users: existingUsers } = await gql.q('query')({
        users: [
          {
            limit: 1,
            where: {
              address: { _ilike: address },
              circle_id: { _eq: circle_id },
              // ignore soft_deleted users
              deleted_at: { _is_null: true },
            },
          },
          {
            id: true,
          },
        ],
      });

      if (existingUsers.length > 0) {
        return res.status(422).json({
          message: `user already exists for ${address}`,
          code: '422',
        });
      }

      await gql.q('mutation')({
        // Insert the user
        insert_users_one: [
          { object: { name, address, circle_id } },
          {
            id: true,
          },
        ],
        // End current nomination
        update_nominees: [
          {
            _set: { ended: true },
            where: {
              id: { _eq: id },
            },
          },
          {
            returning: {
              id: true,
            },
          },
        ],
      });
      res.status(200).json({ message: `user/profile created for ${address}` });
      return;
    }
    res.status(200).json({ message: `nominee created for ${address}` });
  } catch (e) {
    res.status(500).json({
      error: '500',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}

export default verifyHasuraRequestMiddleware(handler);
