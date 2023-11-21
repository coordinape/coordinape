import assert from 'assert';

import { VercelRequest } from '@vercel/node';
import { auth, Client } from 'twitter-api-sdk';

import {
  getProfileFromAuthToken,
  hashTokenString,
} from '../../api-lib/authHelpers';
import { webAppURL } from '../../api-lib/webAppURL';
import { getOAuthCookieValue } from '../../src/features/auth/oauth';

const callback = webAppURL('colinks') + '/api/twitter/callback';

export const authClient = new auth.OAuth2User({
  client_id: process.env.TWITTER_CLIENT_ID as string,
  client_secret: process.env.TWITTER_CLIENT_SECRET as string,
  // callback: cb,
  callback: callback,
  // TODO: consider these scopes
  scopes: ['tweet.read', 'users.read', 'offline.access'],
});

export const getAuthedClient = (
  access_token: string,
  refresh_token: string
) => {
  const ac = new auth.OAuth2User({
    client_id: process.env.TWITTER_CLIENT_ID as string,
    client_secret: process.env.TWITTER_CLIENT_SECRET as string,
    token: {
      access_token,
      refresh_token,
    },
    callback,
    scopes: ['tweet.read', 'users.read', 'offline.access'],
  });
  return new Client(ac);
};

export const getProfileFromCookie = async (req: VercelRequest) => {
  assert(req.headers.cookie, 'No cookie');
  const authCookie = getOAuthCookieValue(req.headers.cookie);
  assert(authCookie);

  const [id, token] = authCookie.split('|');

  const hashedToken = hashTokenString(token);

  assert(id !== 'api', 'no support for API tokens');
  const profile = await getProfileFromAuthToken(Number(id), hashedToken);

  assert(profile, 'Invalid authorization token');
  return {
    profile,
    // this is the verifiable state between requests to prove continuity/security
    state: hashedToken.slice(0, 16),
  };
};

export function generateAuthUrl(state: string) {
  return authClient.generateAuthURL({
    state,
    code_challenge_method: 'plain',
    // TODO: this needs to be a better code challenge later
    code_challenge: Buffer.from(state).toString('base64'),
  });
}
