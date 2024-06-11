import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { getInput } from '../../../../api-lib/handlerHelpers';
import { InternalServerError } from '../../../../api-lib/HttpError';

const networkTiersInputSchema = z.object({
  profile_id: z.number(),
});

//
// type NetworkNode {
//  username: String!
//  avatar: String!
//  profile_id: Int!
//  farcaster_id: Int!
//}
type NetworkNode = {
  username: string;
  avatar: string;
  profile_id: number;
  farcaster_id: number;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload, session } = await getInput(req, networkTiersInputSchema);

  const nodes: NetworkNode[] = [];

  try {
    return res.status(200).json({ nodes });
  } catch (e) {
    throw new InternalServerError('Unable to fetch info from guild', e);
  }
}
