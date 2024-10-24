import {
  CLOUDFLARE_ACCOUNT_ID,
  CLOUDFLARE_IMAGES_API_TOKEN,
} from '../../../api-lib/config';

export async function uploadURLToCloudflare(
  imageUrl: string,
  variant?: string
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
  // console.log({ statusCode: response.status, data: JSON.stringify(data), errors: data?.errors });

  if (variant) {
    const variants = data.result.variants;
    return variants.find((v: string) => v.endsWith(variant));
  } else {
    return data.result.variants[0].replace(/\/\w+$/, '');
  }
}
