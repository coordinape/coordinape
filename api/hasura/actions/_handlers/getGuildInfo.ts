import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { getAddress } from '../../../../api-lib/gql/queries';
import { InternalServerError } from '../../../../api-lib/HttpError';
import {
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
} from '../../../../api-lib/requests/schema';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';
import {
  guildInfoFromAPI,
  isGuildMember,
} from '../../../../src/features/guild/guild-api';

async function handler(req: VercelRequest, res: VercelResponse) {
  const guildInfoInputSchema = z.object({
    id: z.string().or(z.number()),
  });

  const {
    input: { payload: input },
    session_variables: sessionVariables,
  } = composeHasuraActionRequestBodyWithSession(
    guildInfoInputSchema,
    HasuraUserSessionVariables
  ).parse(req.body);

  const { hasuraProfileId } = sessionVariables;
  const address = await getAddress(hasuraProfileId);

  try {
    const guildInfo = await guildInfoFromAPI(input.id);
    const isMember = await isGuildMember(guildInfo.id, address);

    return res.status(200).json({ ...guildInfo, isMember });
  } catch (e) {
    throw new InternalServerError('Unable to fetch info from guild', e);
  }
}

export default verifyHasuraRequestMiddleware(handler);
