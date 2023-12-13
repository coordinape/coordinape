import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { handlerSafe } from '../../../../api-lib/handlerSafe';
import { errorResponse } from '../../../../api-lib/HttpError';
import { addInviteCodes } from '../../../../api-lib/invites';
import { zEthAddressOnly } from '../../../../src/lib/zod/formHelpers';

const replenishInviteCodesInput = z
  .object({
    invited_by_address: zEthAddressOnly.optional(),
    count: z.number(),
  })
  .strict();

async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { payload } = await getInput(req, replenishInviteCodesInput, {
      allowAdmin: true,
    });

    let invitedByFilter = {};
    if (payload.invited_by_address) {
      // lookup profile by address
      const { profiles } = await adminClient.query(
        {
          profiles: [
            {
              where: {
                address: { _ilike: payload.invited_by_address },
              },
            },
            { id: true },
          ],
        },
        { operationName: 'replenishInviteCodes__getProfileByAddress' }
      );
      assert(profiles.length > 0, 'no profiles found for address');
      invitedByFilter = { invited_by: { _eq: profiles[0].id } };
    }

    // find all the users who have used invite codes
    const { profiles: profilesWhoInvited } = await adminClient.query(
      {
        profiles: [
          {
            where: {
              ...invitedByFilter,
              // only return people that have successful invites
              invite_codes_aggregate: {
                count: {
                  filter: {
                    _and: [
                      {
                        invited_id: {
                          _is_null: false,
                        },
                      },
                    ],
                  },
                  predicate: {
                    _gt: 0,
                  },
                },
              },
            },
          },
          {
            id: true,
            invite_codes: [{}, { invited_id: true }],
          },
        ],
      },
      { operationName: 'replenishInviteCodes__getInviters' }
    );
    assert(
      profilesWhoInvited.length > 0,
      'no profiles found that need replenishing'
    );

    // eslint-disable-next-line no-console
    console.log('profilesWhoInvited', profilesWhoInvited.length);

    const profilesToReplenish: number[] = [];
    for (const profile of profilesWhoInvited) {
      const inviteCodes = profile.invite_codes.length;
      const usedInviteCodes = profile.invite_codes.filter(
        i => i.invited_id
      ).length;

      // what is the ratio bro
      if (
        usedInviteCodes > 0 &&
        inviteCodes > 0 &&
        usedInviteCodes / inviteCodes > 0.5
      ) {
        profilesToReplenish.push(profile.id);
      }
    }

    // eslint-disable-next-line no-console
    console.log('profilesToReplenish', profilesWhoInvited.length);

    assert(
      profilesToReplenish.length > 0,
      'no profiles found that need replenishing'
    );
    for (const profileId of profilesToReplenish) {
      await addInviteCodes(profileId, payload.count);
    }

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}

export default handlerSafe(handler);
