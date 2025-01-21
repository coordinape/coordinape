import type { VercelRequest, VercelResponse } from '@vercel/node';

import { InternalServerError } from '../../../../api-lib/HttpError.ts';
import { fetchCastsForChannel } from '../../../../api-lib/neynar.ts';
import { getBestCast } from '../../../../api-lib/openai.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let channels: string[] = [];
  let withinSeconds = 3600;
  let quality = 'interesting';

  const {
    channels: raw_channels,
    within_seconds: raw_within_seconds,
    quality: raw_quality,
  } = req.query;
  if (typeof raw_channels == 'string') {
    channels = JSON.parse(raw_channels);
  }

  if (typeof raw_within_seconds == 'string') {
    withinSeconds = parseInt(raw_within_seconds);
  }

  if (typeof raw_quality == 'string') {
    quality = raw_quality;
  }

  try {
    const casts = await fetchCastsForChannel(channels, withinSeconds);

    const ai_resp = await getBestCast(casts, quality);
    const reasoning = ai_resp.reasoning;

    return res.status(200).json({ casts: casts[0], reasoning });
  } catch (e) {
    console.error(e);
    throw new InternalServerError('Error occurred searching profiles', e);
  }
}
