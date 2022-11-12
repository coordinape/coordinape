import { URLSearchParams } from 'url';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { request } from 'undici';

type AccessTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: 'Bearer';
};

type DiscordMember = {
  id: string;
  username: string;
  discriminator: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code } = req.query;

  if (!code) {
    console.error('code is required');
  }

  // TODO Check if profile is already linked

  try {
    const tokenResponseData = await request(
      'https://discord.com/api/oauth2/token',
      {
        method: 'POST',
        body: new URLSearchParams({
          client_id: process.env.DISCORD_BOT_CLIENT_ID,
          client_secret: process.env.DISCORD_BOT_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: process.env.DISCORD_BOT_REDIRECT_URI,
          scope: 'identify',
        }).toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const oauthData: AccessTokenResponse = await tokenResponseData.body.json();

    // TODO Save OAuth data (access_token, token_type, expires_in, refresh_token, scope)

    const user = await getDiscordMember(oauthData);

    res.status(200).send(user);
  } catch (error) {
    console.error(error);
  }
}

export async function getDiscordMember({
  token_type,
  access_token,
}: AccessTokenResponse): Promise<DiscordMember> {
  try {
    const userResult = await request('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${token_type} ${access_token}`,
      },
    });

    return userResult.body.json();
  } catch (error: any) {
    throw new Error(error);
  }
}
