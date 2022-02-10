import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { COORDINAPE_USER_ADDRESS } from '../../../api-lib/config';
import { gql } from '../../../api-lib/Gql';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import {
  createCircleSchemaInput,
  composeHasuraActionRequestBody,
} from '../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      input: { object: input },
      session_variables: sessionVariables,
    } = composeHasuraActionRequestBody(createCircleSchemaInput).parse(req.body);

    if (sessionVariables.hasuraRole !== 'admin') {
      if (input.protocol_id) {
        const isAdmin = await gql.checkAddressAdminInOrg(
          sessionVariables.hasuraAddress,
          input.protocol_id
        );
        if (!isAdmin) {
          return res.status(422).json({
            extensions: [],
            message:
              'Address is not an admin of any circles under this protocol',
            code: '422',
          });
        }
      }
      const ret = await gql.insertCircleWithAdmin(
        input,
        sessionVariables.hasuraAddress,
        COORDINAPE_USER_ADDRESS
      );
      return res.status(200).json(ret);
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(422).json({
        extensions: err.issues,
        message: 'Invalid input',
        code: '422',
      });
    }
  }
}

export default verifyHasuraRequestMiddleware(handler);
