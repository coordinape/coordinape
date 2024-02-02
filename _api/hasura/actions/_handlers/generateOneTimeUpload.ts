import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  CLOUDFLARE_IMAGES_API_TOKEN,
  CLOUDFLARE_ACCOUNT_ID,
} from '../../../../api-lib/config';
import { ValueTypes } from '../../../../api-lib/gql/__generated__/zeus';
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

    const response_data = await resp.json();

    // need to map uploadURL to upload_url
    const { id, uploadURL: upload_url } = response_data.result;
    const data: ValueTypes['UploadUrlResponse'] = {
      ...response_data,
      result: { id, upload_url },
    };

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error generating link:', error);
    throw error;
  }
}
