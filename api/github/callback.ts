import assert from 'assert';

import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import { Octokit } from 'octokit';

import { adminClient } from '../../api-lib/gql/adminClient';
import { handlerSafe } from '../../api-lib/handlerSafe';
import { errorResponse } from '../../api-lib/HttpError';
import { paths } from '../../src/routes/paths';
import { getProfileFromCookie } from '../twitter/twitter';

const GITHUB_APP_ID = process.env.GITHUB_APP_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY ?? '';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID ?? '';

async function handler(req: VercelRequest, res: VercelResponse) {
  const { profile } = await getProfileFromCookie(req);
  if (!profile) {
    throw new Error(`Can't connect github, not logged in`);
  }

  try {
    const { code } = req.query;
    const installation_id = req.query.installation_id as string;

    const body = {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code: code,
    };
    try {
      // 1. Exchange code for user access token
      const authResponse = await fetch(
        'https://github.com/login/oauth/access_token',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );
      assert(authResponse.ok, 'Failed to get access token');
      const authData = await authResponse.json();
      const userAccessToken = authData.access_token;

      const privateKey = Buffer.from(GITHUB_PRIVATE_KEY, 'base64');
      // 2. Generate a JWT for app authentication
      const appToken = jwt.sign({}, privateKey, {
        algorithm: 'RS256',
        expiresIn: '10m',
        issuer: GITHUB_APP_ID,
      });

      // 3. Obtain an installation access token
      const installationResponse = await fetch(
        `https://api.github.com/app/installations/${installation_id}/access_tokens`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${appToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );
      const installationData = await installationResponse.json();
      const installationAccessToken = installationData.token;

      // 4. You now have tokens to make API requests on behalf of the user and the installation.
      const octokit = new Octokit({ auth: userAccessToken });
      const { data: user } = await octokit.rest.users.getAuthenticated();

      await adminClient.mutate(
        {
          insert_github_accounts_one: [
            {
              object: {
                email: user.email,
                profile_id: profile.id,
                github_id: user.id,
                username: user.login,
                avatar_url: user.avatar_url,
                name: user.name,
                bio: user.bio,
                company: user.company,
                location: user.location,
                twitter_username: user.twitter_username,
                github_created_at: user.created_at,
                blog: user.blog,
                followers: user.followers,
                following: user.following,
                public_repos: user.public_repos,
                installation_token: installationAccessToken,
                user_token: userAccessToken,
              },
            },
            {
              __typename: true,
            },
          ],
        },
        {
          operationName: 'insert_github_user',
        }
      );
      return res.redirect(paths.coLinksAccount);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  } catch (error: any) {
    return errorResponse(res, error);
  }
}

export default handlerSafe(handler);
