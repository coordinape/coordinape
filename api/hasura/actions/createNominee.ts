import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { getUserFromAddress } from '../../../api-lib/findUser';
import {
  insertNominee,
  getUserFromProfileIdWithCircle,
  getNomineeFromAddress,
} from '../../../api-lib/nominees';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import { GraphQLError } from '../../../src/lib/gql/zeusHasuraAdmin';
import {
  createNomineeSchemaInput,
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
} from '../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      input: { payload: input },
      session_variables: sessionVariables,
    } = composeHasuraActionRequestBodyWithSession(
      createNomineeSchemaInput,
      HasuraUserSessionVariables
    ).parse(req.body);

    const profileId = sessionVariables.hasuraProfileId;
    const { circle_id, address, name, description } = input;

    // check if nominator is from the same circle
    const nominator = await getUserFromProfileIdWithCircle(
      profileId,
      circle_id
    );
    assert(nominator);
    const {
      id: nominated_by_user_id,
      circle: { nomination_days_limit, min_vouches: vouches_required },
    } = nominator;

    // check if address already exists in the circle
    const user = await getUserFromAddress(address, circle_id);
    if (user) {
      return res.status(422).json({
        message: 'User with address already exists in the circle',
        code: '422',
      });
    }

    // check if user exists in nominee table same circle and not ended
    const checkAddressExists = await getNomineeFromAddress(address, circle_id);
    if (checkAddressExists) {
      return res.status(422).json({
        message: 'User with address already exists as a nominee',
        code: '422',
      });
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
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(422).json({
        extensions: err.issues,
        message: 'Invalid input',
        code: '422',
      });
    } else if (err instanceof GraphQLError) {
      return res.status(422).json({
        code: '422',
        message: 'GQL Query Error',
        extensions: err.response.errors,
      });
    }
    return res.status(401).json({
      message: 'User does not belong to this circle',
      code: '401',
    });
  }
}

export default verifyHasuraRequestMiddleware(handler);
