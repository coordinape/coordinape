import type { VercelRequest, VercelResponse } from '@vercel/node';

import { InternalServerError } from '../../../../api-lib/HttpError.ts';
import { fetchCastsForChannel } from '../../../../api-lib/neynar.ts';
import { getChannelInsights } from '../../../../api-lib/openai.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let channel: string = '';
  let withinSeconds = 3600;

  const { channel: raw_channel, within_seconds: raw_within_seconds } =
    req.query;

  if (typeof raw_channel === 'string') {
    channel = raw_channel;
  }

  if (typeof raw_within_seconds === 'string') {
    withinSeconds = parseInt(raw_within_seconds);
  }

  try {
    const casts = await fetchCastsForChannel([channel], withinSeconds);

    const ai_resp = await getChannelInsights(casts);

    return res.status(200).json({ insights: ai_resp });
  } catch (e) {
    console.error(e);
    throw new InternalServerError(
      'Error occurred while getting channel insights',
      e
    );
  }
}
