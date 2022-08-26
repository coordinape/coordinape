import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorResponse } from '../../../api-lib/HttpError';
import { Awaited } from '../../../api-lib/ts4.5shim';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let token: string | undefined;
    if (typeof req.query.token == 'string') {
      token = req.query.token;
    } else {
      token = req.query.token.pop();
    }

    if (!token) {
      throw new Error('empty token provided');
    }
    const circle = await circleFromToken(token);
    return res.status(200).send(circle);
  } catch (error: any) {
    errorResponse(res, error);
  }
}

async function circleFromToken(token: string) {
  const { circle_share_tokens } = await adminClient.query(
    {
      circle_share_tokens: [
        {
          where: {
            uuid: {
              _eq: token,
            },
            circle: {
              deleted_at: {
                _is_null: true,
              },
            },
          },
        },
        {
          type: true,
          circle: {
            id: true,
            logo: true,
            name: true,
            organization: {
              name: true,
              logo: true,
            },
            users: [
              {
                limit: 3,
                where: {
                  role: { _eq: 1 },
                },
              },
              {
                name: true,
                profile: {
                  avatar: true,
                },
              },
            ],
          },
        },
      ],
    },
    {
      operationName: 'circleFromToken',
    }
  );

  const tokenResult = circle_share_tokens?.pop();
  if (!tokenResult || !tokenResult.circle) {
    throw new Error('invalid token provided or not found');
  }
  return { ...tokenResult, token };
}

export type TokenJoinInfo = Awaited<ReturnType<typeof circleFromToken>>;
