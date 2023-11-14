import { VercelRequest, VercelResponse } from '@vercel/node';

import {
  linkedin_accounts_constraint,
  linkedin_accounts_update_column,
} from '../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../api-lib/gql/adminClient';
import { handlerSafe } from '../../api-lib/handlerSafe';
import { paths } from '../../src/routes/paths';
import { getProfileFromCookie } from '../twitter/twitter';

import { getAccessToken, getUserInfo } from './linkedin';

async function handler(req: VercelRequest, res: VercelResponse) {
  const { profile, state } = await getProfileFromCookie(req);
  if (!profile) {
    throw new Error(`Can't connect linkedin, not logged in`);
  }

  // get the code/state from LinkedIn's redirect
  const { code, state: queryState } = req.query;

  // check state
  if (state !== queryState) return res.status(500).send("State isn't matching");

  // convert the code to an access token
  const accessToken = await getAccessToken(code as string);

  // get the meager userInfo we are so kindly allowed
  const ui = await getUserInfo(accessToken.access_token);

  // ok need to make sure this account isn't already linked to another user
  const { linkedin_accounts } = await adminClient.query(
    {
      linkedin_accounts: [
        {
          where: {
            _and: [
              {
                sub: {
                  _eq: ui.sub,
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
      operationName: 'linkedin_accounts_by_sub_for_dupes',
    }
  );
  // if there is an existing different account already connected, we need to fail
  if (linkedin_accounts.pop()) {
    const err = 'This LinkedIn account is already linked to another user';
    return res.redirect(
      paths.coLinksAccount + '?error=' + encodeURIComponent(err)
    );
  }

  // store/update data in the database
  await adminClient.mutate(
    {
      insert_linkedin_accounts_one: [
        {
          object: {
            profile_id: profile.id,
            picture: ui.picture,
            name: ui.name,
            email: ui.email,
            country: ui.locale.country,
            language: ui.locale.language,
            email_verified: ui.email_verified,
            sub: ui.sub,
            given_name: ui.given_name,
            family_name: ui.family_name,
            access_token: accessToken.access_token,
            expires_in: accessToken.expires_in,
            scope: accessToken.scope,
          },
          on_conflict: {
            constraint: linkedin_accounts_constraint.linkedin_account_pkey,
            update_columns: [
              linkedin_accounts_update_column.access_token,
              linkedin_accounts_update_column.country,
              linkedin_accounts_update_column.email,
              linkedin_accounts_update_column.email_verified,
              linkedin_accounts_update_column.expires_in,
              linkedin_accounts_update_column.family_name,
              linkedin_accounts_update_column.given_name,
              linkedin_accounts_update_column.language,
              linkedin_accounts_update_column.name,
              linkedin_accounts_update_column.picture,
              linkedin_accounts_update_column.scope,
              linkedin_accounts_update_column.sub,
            ],
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'insert_linkedin_accounts_in_callback',
    }
  );
  return res.redirect(paths.coLinksAccount);
}

export default handlerSafe(handler);
