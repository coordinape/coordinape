import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { getInput } from '../../../../api-lib/handlerHelpers';
import { InternalServerError } from '../../../../api-lib/HttpError';

const networkInputSchema = z
  .object({
    profile_id: z.number().optional(),
    farcaster_id: z.number().optional(),
  })
  .refine(data => data.profile_id || data.farcaster_id, {
    message: 'profile_id or farcaster_id is required',
  });

type NetworkNode = {
  username: string;
  avatar: string;
  profile_id: number;
  farcaster_id: number;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload, session } = await getInput(req, networkInputSchema);

  // eslint-disable-next-line no-console
  console.log({ viewer: session.hasuraProfileId });

  // eslint-disable-next-line no-console
  console.log('payload', payload);

  const nodes: NetworkNode[] = [];

  try {
    return res.status(200).json({ nodes });
  } catch (e) {
    throw new InternalServerError('Unable to fetch info from guild', e);
  }
}
