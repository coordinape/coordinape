import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { getAddress } from '../../../../api-lib/gql/queries';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { InternalServerError } from '../../../../api-lib/HttpError';
import {
  guildInfoFromAPI,
  isGuildMember,
} from '../../../../src/features/guild/guild-api';

const guildInfoInputSchema = z.object({
  id: z.string().or(z.number()),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload, session } = await getInput(req, guildInfoInputSchema);
  const address = await getAddress(session.hasuraProfileId);

  try {
    const guildInfo = await guildInfoFromAPI(payload.id);
    const isMember = await isGuildMember(guildInfo.id, address);

    return res.status(200).json({ ...guildInfo, isMember });
  } catch (e) {
    throw new InternalServerError('Unable to fetch info from guild', e);
  }
}
