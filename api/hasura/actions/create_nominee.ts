import assert from 'assert';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import {
  insertNominee,
  getUserFromProfileIdWithCircle,
  getUserFromAddress,
  getNomineeFromAddress,
} from '../../../api-lib/createNomineeMutations';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import { GraphQLError } from '../../../src/lib/gql/zeusHasuraAdmin';
import {
  createNomineeSchemaInput,
  composeHasuraActionRequestBody,
} from '../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      input: { object: input },
      session_variables: sessionVariables,
    } = composeHasuraActionRequestBody(createNomineeSchemaInput).parse(
      req.body
    );
    const { circle_id, address, name, description } = input;

    if (sessionVariables.hasuraRole !== 'admin') {
      const profileId = sessionVariables.hasuraProfileId;

      // check if nominator is from the same circle
      const user = await getUserFromProfileIdWithCircle(profileId, circle_id);
      assert(user);
      const { circle } = user;
      // check if address already exists in the circle
      const users = await getUserFromAddress(input.address, circle_id);
      if (users.length) {
        return res.status(422).json({
          message: 'User with address already exists in the circle',
          code: '422',
        });
      }

      // check if user exists in nominee table same circle and not ended
      const nominees = await getNomineeFromAddress(input.address, circle_id);
      if (nominees.length) {
        return res.status(422).json({
          message: 'User with address already exists as a nominee',
          code: '422',
        });
      }
      const nominee = await insertNominee(
        user.id,
        circle_id,
        address,
        name,
        description,
        circle.nomination_days_limit,
        circle.min_vouches

      );
      return res.status(200).json(nominee);
    }
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
  return res.status(401).json({
    code: '401',
    message: 'Unexpected error',
  });
}

export default verifyHasuraRequestMiddleware(handler);