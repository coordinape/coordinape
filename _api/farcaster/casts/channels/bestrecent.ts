import type { VercelRequest, VercelResponse } from '@vercel/node';

import { InternalServerError } from '../../../../api-lib/HttpError.ts';
import { fetchCastsForChannel } from '../../../../api-lib/neynar.ts';
import { getBestCast } from '../../../../api-lib/openai.ts';
import { describeImage } from '../../../../src/features/ai/replicate.ts';

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
    const cast = casts[ai_resp.most_interesting_index];

    const embeds = cast?.embeds;

    let imageDesc = '';
    if (embeds) {
      try {
        // Extract image URL if present
        const imageUrl =
          embeds?.find(
            //@ts-ignore
            embed => embed.metadata?.content_type?.startsWith('image/')
            //@ts-ignore
          )?.url || null;

        if (imageUrl) {
          // eslint-disable-next-line no-console
          console.log(
            `Found image URL: ${imageUrl}, describing it with replicate`
          );

          imageDesc = await describeImage(imageUrl);
        }
      } catch (e) {
        console.error('image decribing failed', e);
      }
    }

    return res.status(200).json({ cast, reasoning, imageDesc });
  } catch (e) {
    console.error(e);
    throw new InternalServerError('Error occurred searching profiles', e);
  }
}
