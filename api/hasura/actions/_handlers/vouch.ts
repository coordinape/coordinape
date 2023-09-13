import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import {
  getUserFromAddress,
  getUserFromProfileId,
} from '../../../../api-lib/findUser';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import * as mutations from '../../../../api-lib/gql/mutations';
import * as queries from '../../../../api-lib/gql/queries';
import { getInput } from '../../../../api-lib/handlerHelpers';
import {
  errorResponse,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnprocessableError,
} from '../../../../api-lib/HttpError';
import { Awaited } from '../../../../api-lib/ts4.5shim';
import { ENTRANCE } from '../../../../src/common-lib/constants';

const vouchApiInput = z
  .object({
    nominee_id: z.number(),
    voucher_profile_id: z.number().int().positive().optional(),
  })
  .strict();

type Voucher = Awaited<ReturnType<typeof getUserFromProfileId>>;
type Nominee = Required<
  NonNullable<Awaited<ReturnType<typeof mutations.insertVouch>>>
>['nominee'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { payload, session } = await getInput(req, vouchApiInput, {
      apiPermissions: ['create_vouches'],
    });

    let voucherProfileId: number | null;
    if (session.hasuraRole === 'user') {
      voucherProfileId = session.hasuraProfileId;
      // Allow passing in voucher_profile_id for api-users to vouch on behalf of a user
    } else if (session.hasuraRole === 'api-user') {
      // Make sure this field is here since it is optional in zod (not required for user-authed non-api key call)
      assert(
        'voucher_profile_id' in payload,
        'voucher_profile_id not specified'
      );
      // just to make TS happy
      assert(payload.voucher_profile_id);
      voucherProfileId = payload.voucher_profile_id;

      // Check if voucher exists in the same circle as the API key
      // TODO: this uses assert for error handling
      const voucher = await getUserFromProfileId(
        voucherProfileId,
        session.hasuraCircleId
      );
      if (!voucher) {
        throw new Error('The voucher is not a member of this circle');
      }
    } else {
      throw new Error('This role cannot call this mutation');
    }

    const { nominee_id: nomineeId } = payload;

    // validate that this is allowed
    const { voucher } = await validate(nomineeId, voucherProfileId);

    // vouch and build user if needed
    const updatedNominee = await vouch(nomineeId, voucher);

    return res.status(200).json({ id: updatedNominee.id });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}

async function validate(nomineeId: number, voucherProfileId: number) {
  // Get the nominee
  const nominee = await getNominee(nomineeId);

  // make sure circle exists
  if (!nominee.circle) {
    throw new NotFoundError('circle not found');
  }

  // Check if voucher exists in the same circle as the nominee
  // TODO: this uses assert for error handling
  const voucher = await getUserFromProfileId(
    voucherProfileId,
    nominee.circle_id
  );

  // If circle only allows giver to vouch, make sure voucher is a giver
  if (nominee.circle.only_giver_vouch && voucher.non_giver) {
    throw new ForbiddenError(
      "voucher is a 'non-giver' so is not allowed to vouch"
    );
  }

  // make sure the nomination period hasn't ended
  if (nominee.ended) {
    throw new UnprocessableError(
      'nomination has already ended for this nominee'
    );
  }

  // TODO: could this be handled by a unique index in the vouches table?
  // Check if voucher already has an existing vouch for the nominee
  if (nominee.nominated_by_user_id === voucher.id) {
    throw new ForbiddenError(
      "voucher nominated this nominee so can't additionally vouch"
    );
  }

  const user = await getUserFromAddress(nominee.address, nominee.circle_id);
  if (user) {
    throw new ForbiddenError('User with this address already exists');
  }

  const { vouches } = await queries.getExistingVouch(nomineeId, voucher.id);

  if (vouches.pop()) {
    throw new ForbiddenError('voucher has already vouched for this nominee');
  }

  return {
    voucher,
  };
}

async function vouch(nomineeId: number, voucher: Voucher) {
  // vouch for the nominee

  // this inserts the vouch and also fetches the nominee with updated vouch count
  const insert_vouches = await mutations.insertVouch(nomineeId, voucher.id);
  if (!insert_vouches?.nominee) {
    throw new InternalServerError('unable to add vouch');
  }

  // the vouching is announced with an event trigger

  const nominee = insert_vouches.nominee;

  // if there are enough nominations, go ahead and add the user to the circle
  const nomCount = nominee.nominations_aggregate.aggregate?.count || 0;
  if (nominee.vouches_required - 1 <= nomCount) {
    return await convertNomineeToUser(nominee);
  }

  return nominee;
}

async function convertNomineeToUser(nominee: Nominee) {
  // Get the nominee into the user table
  let userId = nominee.user_id;
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: { address: { _eq: nominee.address.toLowerCase() } },
          limit: 1,
        },
        { id: true },
      ],
    },
    { operationName: 'vouch_getProfileId' }
  );

  if (!userId) {
    const addedUser = await mutations.insertUser(
      nominee.address,
      nominee.circle_id,
      ENTRANCE.NOMINATION,
      profiles[0].id
    );
    if (!addedUser) {
      throw new InternalServerError('unable to add user');
    }
    userId = addedUser.id;
    assert(userId);
  }
  // The profile is automatically created by the createProfile event trigger, if needed

  // attach the user id to the nominee, and mark the nomination ended
  const updatedNominee = await mutations.updateNomineeUser(nominee.id, userId);
  if (!updatedNominee) {
    throw new InternalServerError('unable to update nominee userId');
  }

  // the nomineeVouchedIn event handlers will run and announce the user being vouched in

  return updatedNominee;
}

async function getNominee(nomineeId: number) {
  const nom = await queries.getNominee(nomineeId);
  if (!nom.nominees_by_pk) {
    throw `nominee ${nomineeId} not found`;
  }
  return nom.nominees_by_pk;
}
