import assert from 'assert';

import { VercelRequest, VercelResponse } from '@vercel/node';

import {
  twitter_accounts_constraint,
  twitter_accounts_update_column,
} from '../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../api-lib/gql/adminClient';
import { handlerSafe } from '../../api-lib/handlerSafe';
import { paths } from '../../src/routes/paths';

import {
  authClient,
  generateAuthUrl,
  getAuthedClient,
  getProfileFromCookie,
} from './twitter';

async function handler(req: VercelRequest, res: VercelResponse) {
  const { profile, state } = await getProfileFromCookie(req);
  if (!profile) {
    throw new Error(`Can't connect twitter, not logged in`);
  }

  const { code, state: queryState } = req.query;
  if (state !== queryState) return res.status(500).send("State isn't matching");
  // This is to regenerate the state in the ridiculously stateful authClient for the code_verifier
  generateAuthUrl(state);
  const { token } = await authClient.requestAccessToken(code as string);
  assert(token.access_token);
  assert(token.refresh_token);
  const ac = getAuthedClient(token.access_token, token.refresh_token);
  const { data: user } = await ac.users.findMyUser({
    'user.fields': [
      'created_at',
      'description',
      // 'entities',
      'id',
      'location',
      'name',
      // 'pinned_tweet_id',
      'profile_image_url',
      // 'protected',
      'public_metrics',
      'url',
      'username',
      'verified',
      // 'withheld',
    ],
  });
  assert(user);

  // ok need to make sure this account isn't already linked to another user
  const { twitter_accounts } = await adminClient.query(
    {
      twitter_accounts: [
        {
          where: {
            _and: [
              {
                id: {
                  _eq: user.id,
                },
              },
              {
                profile_id: {
                  _neq: profile.id,
                },
              },
            ],
          },
        },
        {
          profile_id: true,
        },
      ],
    },
    {
      operationName: 'twitter_accounts_by_sub_for_dupes',
    }
  );
  // if there is an existing different account already connected, we need to fail
  if (twitter_accounts.pop()) {
    // TODO: this should redirect to an error page rather than just show json in the browser
    return res
      .status(400)
      .send('This Twitter account is already linked to another user');
  }

  await adminClient.mutate(
    {
      insert_twitter_accounts_one: [
        {
          object: {
            id: user.id,
            name: user.name,
            username: user.username,
            profile_image_url: user.profile_image_url,
            verified: user.verified,
            followers_count: user.public_metrics?.followers_count,
            following_count: user.public_metrics?.following_count,
            description: user.description,
            url: user.url,
            created_at: user.created_at,
            location: user.location,
            access_token: token.access_token,
            refresh_token: token.refresh_token,
            twitter_created_at: user.created_at,
            expires_at: token.expires_at,
            profile_id: profile.id,
          },
          on_conflict: {
            constraint: twitter_accounts_constraint.twitter_account_pkey,
            update_columns: [twitter_accounts_update_column.username],
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'insert_twitter_user',
    }
  );
  res.redirect(paths.coLinksAccount);
}

export default handlerSafe(handler);
