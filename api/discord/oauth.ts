import { URLSearchParams } from 'url';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { request } from 'undici';

import {
  DISCORD_BOT_CLIENT_ID,
  DISCORD_BOT_CLIENT_SECRET,
  DISCORD_BOT_REDIRECT_URI,
} from '../../api-lib/config';

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

/**
 * Authorization Code Grant for Discord
 *
 * Retrieves the discord user's access token and exchanges it for a user's access token. Uses the access token
 * to fetch and return discord user's details, including the snowflake id.
 *
 * https://discord.com/developers/docs/topics/oauth2#authorization-code-grant
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code } = req.query;

  if (!code) {
    console.error('code is required');
  }

  try {
    const tokenResponseData = await request(
      'https://discord.com/api/oauth2/token',
      {
        method: 'POST',
        body: new URLSearchParams({
          client_id: DISCORD_BOT_CLIENT_ID,
          client_secret: DISCORD_BOT_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: DISCORD_BOT_REDIRECT_URI,
          scope: 'identify',
        }).toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const oauthData: AccessTokenResponse =
      (await tokenResponseData.body.json()) as AccessTokenResponse;

    const user = await getDiscordMember(oauthData);

    // Send ephemeral message to discord

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

    return userResult.body.json() as Promise<DiscordMember>;
  } catch (error: any) {
    throw new Error(error);
  }
}
