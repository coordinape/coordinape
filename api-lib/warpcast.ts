import { WARPCAST_GIVEBOT_AUTH } from './config';

interface PostData {
  text: string;
  embeds: string[];
  parent_hash?: string;
}

export async function postToWarpcast(data: PostData): Promise<any> {
  const { text, embeds, parent_hash } = data;

  const url = 'https://client.warpcast.com/v2/casts';
  const headers = {
    accept: '*/*',
    'accept-language': 'en-US,en;q=0.8',
    authorization: `Bearer ${WARPCAST_GIVEBOT_AUTH}`,
    'content-type': 'application/json; charset=utf-8',
    origin: 'https://warpcast.com',
    referer: 'https://warpcast.com/',
    'sec-ch-ua': '"Brave";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'sec-gpc': '1',
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  };

  const payload = {
    text,
    embeds,
    ...(parent_hash ? { parent: { hash: parent_hash } } : {}),
  };

  const json_payload = JSON.stringify(payload);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: json_payload,
      signal: AbortSignal.timeout(5000),
    });

    const response_json = await response.json();

    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.log('response from Warpcast', response_json);

      throw new Error(`Warpcast HTTP error! status: ${response.status}`);
    }

    return response_json;
  } catch (error) {
    console.error('Error posting to Warpcast:', error);
    throw error;
  }
}
