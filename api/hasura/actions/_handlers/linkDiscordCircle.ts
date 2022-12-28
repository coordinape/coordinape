import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';
import {
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
} from '../../../../src/lib/zod';

export const linkDiscordCircleInputSchema = z
  .object({
    circle_id: z.string(),
    token: z.string(),
  })
  .strict();

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload },
  } = composeHasuraActionRequestBodyWithSession(
    linkDiscordCircleInputSchema,
    HasuraUserSessionVariables
  ).parse(req.body);

  const { circle_id, token } = payload;

  const { discord_circle_api_tokens } = await adminClient.query({
    discord_circle_api_tokens: [
      {
        where: { circle_id: { _eq: Number(circle_id) } },
      },
      {
        token: true,
      },
    ],
  });

  if (
    discord_circle_api_tokens.length === 0 ||
    discord_circle_api_tokens.length > 1
  ) {
    return errorResponseWithStatusCode(
      res,
      { message: 'Something went wrong, please contact coordinape support' },
      422
    );
  }

  if (discord_circle_api_tokens[0].token) {
    return errorResponseWithStatusCode(
      res,
      { message: 'An API key was already generated for this circle' },
      422
    );
  }

  const { update_discord_circle_api_tokens } = await adminClient.mutate({
    update_discord_circle_api_tokens: [
      {
        _set: { token },
        where: { circle_id: { _eq: Number(circle_id) } },
      },
      {
        returning: {
          id: true,
        },
      },
    ],
  });
  assert(update_discord_circle_api_tokens, 'panic: Unexpected GQL response');

  const returnResult = update_discord_circle_api_tokens.returning.pop();
  assert(returnResult, 'No return from mutation');

  res.status(200).json(returnResult);
  return;
}

export default verifyHasuraRequestMiddleware(handler);
