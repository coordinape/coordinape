import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  getProfilesWithAddress,
  getProfilesWithName,
} from '../../../../api-lib/findProfile';
import { getUserFromAddress } from '../../../../api-lib/findUser';
import {
  profiles_constraint,
  profiles_update_column,
} from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { updateExpiredNominees } from '../../../../api-lib/gql/mutations';
import { getExpiredNominees } from '../../../../api-lib/gql/queries';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import {
  insertNominee,
  getUserFromProfileIdWithCircle,
  getNomineeFromAddress,
} from '../../../../api-lib/nominees';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';
import {
  createNomineeInputSchema,
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
} from '../../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload: input },
    session_variables: sessionVariables,
  } = composeHasuraActionRequestBodyWithSession(
    createNomineeInputSchema,
    HasuraUserSessionVariables
  ).parse(req.body);

  const profileId = sessionVariables.hasuraProfileId;
  const { circle_id, address, name, description } = input;

  // check if nominator is from the same circle
  const nominator = await getUserFromProfileIdWithCircle(profileId, circle_id);
  if (!nominator) {
    return errorResponseWithStatusCode(
      res,
      { message: 'Nominator does not belong to this circle' },
      422
    );
  }

  const {
    id: nominated_by_user_id,
    circle: { nomination_days_limit, min_vouches: vouches_required },
  } = nominator;

  // check if address already exists in the circle
  const user = await getUserFromAddress(address, circle_id);
  if (user) {
    return errorResponseWithStatusCode(
      res,
      { message: 'User with address already exists in the circle' },
      422
    );
  }

  // check if the name already exists in profiles
  const profile = await getProfilesWithName(name);
  if (
    profile &&
    profile.address.toLocaleLowerCase() !== address.toLocaleLowerCase()
  ) {
    return errorResponseWithStatusCode(
      res,
      { message: 'This name is already in use' },
      422
    );
  }

  // check if this address has a profile
  const addressProfile = await getProfilesWithAddress(address);
  if (!addressProfile || !addressProfile?.name) {
    //update profile name with the entered name
    const mutationResult = await adminClient.mutate(
      {
        insert_profiles_one: [
          {
            object: {
              name: name,
              address: address,
            },
            on_conflict: {
              constraint: profiles_constraint.profiles_address_key,
              update_columns: [profiles_update_column.name],
              where: {
                name: { _is_null: true },
              },
            },
          },
          {
            id: true,
          },
        ],
      },
      { operationName: 'createNominee_updateProfileName' }
    );

    const returnResult = mutationResult.insert_profiles_one?.id;
    assert(returnResult, 'No return from mutation');
  }

  const { nominees } = await getExpiredNominees();

  await updateExpiredNominees(nominees.map(n => n.id));

  // check if user exists in nominee table same circle and not ended
  const checkAddressExists = await getNomineeFromAddress(address, circle_id);
  if (checkAddressExists) {
    return errorResponseWithStatusCode(
      res,
      { message: 'User with address already exists as a nominee' },
      422
    );
  }

  // add an event trigger to check if vouches are enough and insert an uesr/profile
  const nominee = await insertNominee({
    nominated_by_user_id,
    circle_id,
    address,
    description,
    nomination_days_limit,
    vouches_required,
  });

  return res.status(200).json(nominee);
}

export default verifyHasuraRequestMiddleware(handler);
