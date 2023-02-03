import { VercelRequest, VercelResponse } from '@vercel/node';

import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import { endNominees, updateCircle } from '../../../../api-lib/gql/mutations';
import { getCircle } from '../../../../api-lib/gql/queries';
import {
  errorResponseWithStatusCode,
  InternalServerError,
  UnprocessableError,
} from '../../../../api-lib/HttpError';
import { guildInfoFromAPI } from '../../../../src/features/guild/guild-api';
import {
  composeHasuraActionRequestBodyWithApiPermissions,
  updateCircleInput,
} from '../../../../src/lib/zod';

const requestSchema = composeHasuraActionRequestBodyWithApiPermissions(
  updateCircleInput,
  ['update_circle']
);

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload: input },
  } = await requestSchema.parseAsync(req.body);

  const { circles_by_pk: circle } = await getCircle(input.circle_id);

  if (input.token_name && input.token_name !== circle?.token_name) {
    errorResponseWithStatusCode(
      res,
      {
        message: `Changing Custom Token Name not allowed`,
      },
      422
    );
    return;
  }

  if (input.guild_id) {
    try {
      // make sure this guild number is good
      const guildInfo = await guildInfoFromAPI(input.guild_id);
      // make sure the role is valid
      if (
        input.guild_role_id &&
        !guildInfo.roles.some(r => r.id == input.guild_role_id)
      ) {
        throw new UnprocessableError('invalid guild role');
      }
    } catch (e) {
      if (e instanceof UnprocessableError) {
        throw e;
      }
      throw new InternalServerError('Unable to fetch info from guild', e);
    }
  } else {
    input.guild_role_id = null;
  }

  const updated = await updateCircle(input);

  if (!input.vouching) {
    await endNominees(input.circle_id);
  }
  res.status(200).json(updated);
}

export default authCircleAdminMiddleware(handler);
