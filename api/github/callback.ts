import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

import { errorResponse } from '../../api-lib/HttpError';

const GITHUB_APP_ID = process.env.GITHUB_APP_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY ?? '';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID ?? '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { code } = req.query;
    const installation_id = req.query.installation_id as string;
    // const setup_action = req.query.setup_action as string;

    const body = {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code: code,
    };
    console.log('BODY=====>', body);
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
      const authData = await authResponse.json();
      const userAccessToken = authData.access_token;

      console.log('AD=====>', authData);
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

      console.log('ID=====>', installationData);
      // 4. You now have tokens to make API requests on behalf of the user and the installation.
      // You can store them in a session, send them to the client, etc.

      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      });

      return res.send(
        `User Token: ${userAccessToken}<br>Installation Token: ${installationAccessToken}<br>User: ${JSON.stringify(
          userResponse.json()
        )}`
      );
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  } catch (error: any) {
    return errorResponse(res, error);
  }
}
