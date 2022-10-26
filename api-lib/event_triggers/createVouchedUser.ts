import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../gql/adminClient';
import * as queries from '../gql/queries';
import { EventTriggerPayload } from '../types';
import { verifyHasuraRequestMiddleware } from '../validate';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    event: { data },
  }: EventTriggerPayload<'nominees', 'INSERT'> = req.body;

  const { name, address, circle_id, vouches_required, id } = data.new;
  try {
    const { nominees_by_pk } = await queries.getNominee(id);
    assert(nominees_by_pk);
    const vouches =
      (nominees_by_pk.nominations_aggregate?.aggregate?.count ?? 0) + 1;
    if (vouches >= vouches_required) {
      const { members: existingMembers } = await adminClient.query(
        {
          members: [
            {
              limit: 1,
              where: {
                address: { _ilike: address },
                circle_id: { _eq: circle_id },
                deleted_at: { _is_null: true },
              },
            },
            {
              id: true,
            },
          ],
        },
        {
          operationName: 'createVouchedMember_findExistingMember',
        }
      );

      if (existingMembers.length > 0) {
        return res.status(422).json({
          message: `member already exists for ${address}`,
          code: '422',
        });
      }

      const { insert_members_one } = await adminClient.mutate(
        {
          insert_members_one: [
            { object: { name, address, circle_id } },
            {
              id: true,
            },
          ],
        },
        {
          operationName: 'createVouchedMember_insertMember',
        }
      );

      if (insert_members_one) {
        await adminClient.mutate(
          {
            // End current nomination
            update_nominees: [
              {
                _set: { ended: true, member_id: insert_members_one.id },
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
          },
          {
            operationName: 'createVouchedMember_updateNominees',
          }
        );
      }

      res
        .status(200)
        .json({ message: `member/profile created for ${address}` });
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
