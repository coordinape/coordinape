import assert from 'assert';

import type {
  VercelRequest,
  VercelResponse,
  VercelApiHandler,
} from '@vercel/node';
import { z } from 'zod';

import { GraphQLError } from '../src/lib/gql/zeusHasuraAdmin';
import { composeHasuraActionRequestBody, circleIdInput } from '../src/lib/zod';

import { getUserFromProfileId } from './findUser';
import { verifyHasuraRequestMiddleware } from './validate';

const middleware =
    (handler: VercelApiHandler) =>
        async (req: VercelRequest, res: VercelResponse) => {
          try {
            const {
              input: { object: input },
              session_variables: sessionVariables,
            } = composeHasuraActionRequestBody(circleIdInput).parse(req.body);

            if (sessionVariables.hasuraRole !== 'admin') {
              const { circle_id } = input;
              const profileId = sessionVariables.hasuraProfileId;

              const { role } = await getUserFromProfileId(profileId, circle_id);
              assert(isCircleAdmin(role));
            }
          } catch (err) {
            if (err instanceof z.ZodError) {
              res.status(422).json({
                extensions: err.issues,
                message: 'Invalid input',
                code: '422',
              });
              return;
            } else if (err instanceof GraphQLError) {
              res.status(422).json({
                code: 422,
                message: 'GQL Query Error',
                extensions: err.response.errors,
              });
            }
            res.status(401).json({
              message: 'User not circle admin',
              code: 401,
            });
            return;
          }
          // the admin role is validated early by zod

          await handler(req, res);
        };

const isCircleAdmin = (role: number): boolean => role === 1;

export const authCircleAdminMiddleware = (handler: VercelApiHandler) =>
    verifyHasuraRequestMiddleware(middleware(handler));