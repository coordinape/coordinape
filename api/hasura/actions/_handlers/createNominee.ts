import type { VercelRequest, VercelResponse } from '@vercel/node';

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
    name,
    description,
    nomination_days_limit,
    vouches_required,
  });

  return res.status(200).json(nominee);
}

export default verifyHasuraRequestMiddleware(handler);
