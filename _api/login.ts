import assert from 'assert';

import { JsonRpcProvider } from '@ethersproject/providers';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { union } from 'lodash-es';
import { DateTime, Settings } from 'luxon';
import { SiweErrorType, SiweMessage } from 'siwe';

import {
  formatAuthHeader,
  generateTokenString,
  hashTokenString,
} from '../api-lib/authHelpers';
import { isCoLinksRequest } from '../api-lib/colinks/hostname';
import { adminClient } from '../api-lib/gql/adminClient';
import { insertInteractionEvents } from '../api-lib/gql/mutations';
import { errorResponse } from '../api-lib/HttpError';
import { getProvider } from '../api-lib/provider';
import { parseInput } from '../api-lib/signature';
import { loginSupportedChainIds } from '../src/common-lib/constants';
import { COLINKS_LOCAL_URL, GIVE_LOCAL_URL } from '../src/config/webAppURL';
import { getInviteCodeCookieValue } from '../src/features/invites/invitecodes';
import { updateRepScore } from '../src/features/rep/api/updateRepScore';
import { supportedChainIds } from '../src/utils/viem/contracts';

import { createSampleCircleForProfile } from './hasura/actions/_handlers/createSampleCircle';

Settings.defaultZone = 'utc';

const allowedDomainsRegex = (
  process.env.SIWE_ALLOWED_DOMAINS ??
  `${GIVE_LOCAL_URL.split('/')[2].replace(
    'http://',
    ''
  )},${COLINKS_LOCAL_URL.split('/')[2].replace('http://', '')},localhost`
)
  .split(',')
  .filter(item => item !== '');

const allowedDomains = allowedDomainsRegex.map(item => new RegExp(item));

const validChains = union(
  supportedChainIds,
  Object.keys(loginSupportedChainIds)
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { isCoLinks, hostname } = isCoLinksRequest(req);

    const input = parseInput(req);

    const { data, signature, connectorName } = input;

    let address: string;
    let chainId: number;

    try {
      const message = new SiweMessage(data);
      chainId = message.chainId;

      if (
        !allowedDomains.find(allowedRegex => allowedRegex.test(message.domain))
      ) {
        return errorResponse(res, {
          message: 'invalid domain',
          httpStatus: 401,
        });
      }

      // siweProvider is only used for EIP-1271 contract signature validation.
      // If we have a provider, use it. If not, swallor no provider error for
      // supported chains (without support for EP-1271 contract signature
      // validation)
      let siweProvider: JsonRpcProvider = new JsonRpcProvider();
      try {
        siweProvider = getProvider(message.chainId);
      } catch (error: Error | any) {
        if (error.message) {
          const chainId: string = error.message.match(
            /chainId (\d*) is unsupported/
          )[1];
          const supported = validChains.find(obj => obj == chainId);
          if (!supported) {
            return errorResponse(res, {
              message: 'unsupported chain ' + chainId,
              httpStatus: 401,
            });
          }
        }
      }

      const verificationResult = await message.verify(
        { signature },
        { provider: siweProvider }
      );

      if (!verificationResult.success) {
        return errorResponse(res, {
          message: 'invalid signature',
          httpStatus: 401,
        });
      }

      address = message.address.toLowerCase();
    } catch (e: any) {
      if (Object.values(SiweErrorType).some(val => val === e.error.type)) {
        return errorResponse(res, {
          message: 'SIWE error: ' + e.error.type,
          httpStatus: 401,
        });
      } else {
        // Return generic error for non-SIWE exceptions
        return errorResponse(res, {
          message: 'login error: ' + e,
          httpStatus: 401,
        });
      }
    }

    const { profiles } = await adminClient.query(
      {
        profiles: [
          { where: { address: { _ilike: address } } },
          { id: true, connector: true, address: true },
        ],
      },
      { operationName: 'login_getProfile' }
    );

    let profile = profiles.pop();
    const tokenString = generateTokenString();

    if (profile && !profile.connector) {
      await adminClient.mutate(
        {
          update_profiles_by_pk: [
            {
              pk_columns: { id: profile.id },
              _set: { connector: connectorName },
            },
            { id: true, address: true },
          ],
        },
        { operationName: 'login_updateProfileConnector' }
      );
    }

    if (!profile) {
      // check out the invite code, see if they were invited by someone
      let invitedBy: number | undefined;
      if (req.headers?.cookie) {
        const code = getInviteCodeCookieValue(req.headers.cookie);
        if (code) {
          const { profiles } = await adminClient.query(
            {
              profiles: [
                { where: { invite_code: { _eq: code } } },
                { id: true, address: true },
              ],
            },
            {
              operationName: 'login_getInviteCode',
            }
          );

          invitedBy = profiles.pop()?.id;
        }
      }

      // make the new user
      const { insert_profiles_one } = await adminClient.mutate(
        {
          insert_profiles_one: [
            {
              object: {
                address,
                connector: connectorName,
                name: `New User ${address.substring(0, 8)}`,
                invited_by: invitedBy,
              },
            },
            {
              id: true,
              address: true,
              users: [{}, { circle_id: true }],
            },
          ],
        },
        { operationName: 'login_insertProfile' }
      );
      assert(insert_profiles_one, "panic: adding profile didn't succeed");
      profile = insert_profiles_one;
      await insertInteractionEvents({
        event_type: 'first_login',
        profile_id: insert_profiles_one.id,
        circle_id: insert_profiles_one.users?.[0]?.circle_id,
        data: {
          chainId,
          hostname,
          coLinks: isCoLinks,
          brandNew: insert_profiles_one.users
            ? insert_profiles_one.users.length === 0
            : true,
        },
      });
      // if they have no users, this is a "clean signup"
      // let's also add a sample circle?
      // TODO: this will happen for magic link invite people too, maybe weird

      // don't create sample circles for CoLinks users
      if (!isCoLinks) {
        try {
          await createSampleCircleForProfile(profile.id, address);
        } catch (error: any) {
          console.error('error creating sample circle', error);
        }
      }

      if (invitedBy) {
        // update the rep score of the inviter
        // TODO: if updating score becomes expensive this needs to be async -g
        await updateRepScore(invitedBy);
      }
    }
    const now = DateTime.now().toISO();

    const { insert_personal_access_tokens_one: token } =
      await adminClient.mutate(
        {
          delete_personal_access_tokens: [
            { where: { profile: { address: { _ilike: address } } } },
            { affected_rows: true },
          ],
          insert_personal_access_tokens_one: [
            {
              object: {
                name: 'circle-access-token',
                abilities: '["read"]',
                tokenable_type: 'App\\Models\\Profile',
                tokenable_id: profile.id,
                token: hashTokenString(tokenString),
                updated_at: now,
                created_at: now,
                last_used_at: now,
              },
            },
            { id: true },
          ],
        },
        { operationName: 'login_insertAccessToken' }
      );

    await insertInteractionEvents({
      event_type: 'login',
      profile_id: profile.id,
      data: { chainId, hostname, coLinks: isCoLinks },
    });

    return res.status(200).json({
      token: formatAuthHeader(token?.id, tokenString),
      id: profile.id,
      address: profile.address,
    });
  } catch (error: any) {
    return errorResponse(res, error);
  }
}
