import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getAddress } from '../../../../api-lib/gql/queries';
import { UnprocessableError } from '../../../../api-lib/HttpError';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';
import { CircleTokenType } from '../../../../src/common-lib/circleShareTokens';
import {
  createUserFromTokenInput,
  HasuraUserSessionVariables,
  composeHasuraActionRequestBodyWithSession,
} from '../../../../src/lib/zod';

import { createUserMutation } from './createUserMutation';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload: input },
    session_variables: sessionVariables,
  } = composeHasuraActionRequestBodyWithSession(
    createUserFromTokenInput,
    HasuraUserSessionVariables
  ).parse(req.body);

  // get address from currrent user
  const { hasuraProfileId } = sessionVariables;
  const address = await getAddress(hasuraProfileId);

  // get the circleId from the token and make sure its magic
  const { circle_share_tokens } = await adminClient.query({
    circle_share_tokens: [
      {
        where: {
          uuid: {
            _eq: input.token,
          },
          circle: {
            deleted_at: {
              _is_null: true,
            },
          },
          type: {
            _eq: CircleTokenType.Magic,
          },
        },
      },
      {
        circle_id: true,
      },
    ],
  });

  const circleId = circle_share_tokens.pop()?.circle_id;
  if (!circleId) {
    throw new UnprocessableError('invalid circle link');
  }

  // create the user
  const mutationResult = await createUserMutation(address, circleId, {
    name: input.name,
    circle_id: circleId,
  });

  return res
    .status(200)
    .json(mutationResult.insert_users_one ?? mutationResult.update_users_by_pk);
}

export default verifyHasuraRequestMiddleware(handler);
