import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../api-lib/gql/adminClient';
import { errorResponse } from '../../api-lib/HttpError';
import { Awaited } from '../../api-lib/ts4.5shim';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let token: string | undefined;
    if (typeof req.query.token == 'string') {
      token = req.query.token;
    } else if (Array.isArray(req.query.token)) {
      token = req.query.token.pop();
    }

    assert(token, 'no token provided');
    const data = await getTokenData(token);
    return res.status(200).send(data);
  } catch (error: any) {
    return errorResponse(res, error);
  }
}

async function getTokenData(token: string) {
  const { circle_share_tokens, org_share_tokens } = await adminClient.query(
    {
      circle_share_tokens: [
        {
          where: {
            uuid: { _eq: token },
            circle: { deleted_at: { _is_null: true } },
          },
        },
        {
          type: true,
          circle: {
            id: true,
            logo: true,
            name: true,
            guild_id: true,
            guild_role_id: true,
            organization: { name: true, logo: true },
            __alias: {
              admins: {
                users: [
                  { limit: 3, where: { role: { _eq: 1 } } },
                  { profile: { avatar: true, name: true } },
                ],
              },
            },
          },
        },
      ],
      org_share_tokens: [
        { where: { uuid: { _eq: token } } },
        {
          type: true,
          organization: {
            id: true,
            name: true,
            logo: true,
            circles: [
              {},
              {
                __alias: {
                  admins: {
                    users: [
                      { limit: 3, where: { role: { _eq: 1 } } },
                      { profile: { avatar: true, name: true } },
                    ],
                  },
                },
              },
            ],
          },
        },
      ],
    },
    { operationName: 'getTokenData' }
  );

  const circleData = circle_share_tokens?.pop();
  const orgData = org_share_tokens?.pop();
  assert(circleData?.circle || orgData?.organization, 'invalid token');
  return { ...circleData, ...orgData, token };
}

export type TokenJoinInfo = Awaited<ReturnType<typeof getTokenData>>;
