import assert from 'assert';

type variant = '/feed' | '/avatar' | '/original' | '/frame';

import {
  CLOUDFLARE_ACCOUNT_ID,
  CLOUDFLARE_IMAGES_API_TOKEN,
} from '../../../api-lib/config';

export async function uploadURLToCloudflare(
  imageUrl: string,
  variant: variant = '/feed'
): Promise<string> {
  const formData = new FormData();
  formData.append('url', imageUrl);
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_IMAGES_API_TOKEN}`,
      },
      body: formData,
    }
  );

  const data = await response.json();
  // eslint-disable-next-line no-console
  console.log('RECEIVED CLOUFLARE RESPONSE', {
    imageUrl,
    variant,
    statusCode: response.status,
    data: JSON.stringify(data),
    errors: data?.errors,
  });

  const variants = data.result.variants;
  const url = variants.find((v: string) => v.endsWith(variant));
  assert(url, 'Variant not found');
  return url;
}
