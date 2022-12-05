import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  getNomineeWithAddress,
  getNomineeWithName,
} from '../../../../api-lib/findNominees';
import {
  getProfilesWithAddress,
  getProfilesWithName,
} from '../../../../api-lib/findProfile';
import { getUserFromAddress } from '../../../../api-lib/findUser';
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

  let profileName = undefined;
  // check if the name already exists in profiles
  const profile = await getProfilesWithName('createNominee', name);
  if (
    profile &&
    profile.address.toLocaleLowerCase() !== address.toLocaleLowerCase()
  ) {
    return errorResponseWithStatusCode(
      res,
      { message: 'This name is used by another coordinape user' },
      422
    );
  } else if (
    profile &&
    profile.address.toLocaleLowerCase() === address.toLocaleLowerCase()
  ) {
    profileName = profile.name;
  }

  if (!profileName) {
    // check if this address has a profile
    const addressProfile = await getProfilesWithAddress(
      'createNominee',
      address
    );
    if (addressProfile) {
      //profile name will replace Nominee name
      profileName = addressProfile.name;
    }

    if (!profileName) {
      //check if this name is used by another Nominee in all circles
      const nomineeWithName = await getNomineeWithName('createNominee', name);
      if (
        nomineeWithName &&
        nomineeWithName.address.toLocaleLowerCase() !==
          address.toLocaleLowerCase()
      ) {
        return errorResponseWithStatusCode(
          res,
          { message: 'This name is used by another coordinape user' },
          422
        );
      } else if (
        nomineeWithName &&
        nomineeWithName.address.toLocaleLowerCase() ===
          address.toLocaleLowerCase()
      ) {
        //to make sure all of the rows contains the same case name
        profileName = nomineeWithName.name;
      }

      if (!profileName) {
        //check if this address is nominated in other circles
        const nomineeWithAddress = await getNomineeWithAddress(
          'createNominee',
          address
        );
        if (nomineeWithAddress) {
          profileName = nomineeWithAddress.name;
        }
      }
    }
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
    name: profileName ?? name,
    description,
    nomination_days_limit,
    vouches_required,
  });

  return res.status(200).json(nominee);
}

export default verifyHasuraRequestMiddleware(handler);
