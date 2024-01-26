import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  CLOUDFLARE_IMAGES_API_TOKEN,
  CLOUDFLARE_ACCOUNT_ID,
} from '../../../../api-lib/config';
import { getInput } from '../../../../api-lib/handlerHelpers';

const URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    session: { hasuraProfileId },
  } = await getInput(req);

  const formData = new FormData();
  formData.append('requireSignedURLs', 'false'); // make upload public
  formData.append('metadata', JSON.stringify({ profileId: hasuraProfileId }));

  try {
    const resp = await fetch(URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_IMAGES_API_TOKEN}`,
      },
      body: formData,
    });

    const data = await resp.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error generating link:', error);
    throw error;
  }
}
