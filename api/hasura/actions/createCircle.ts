import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { COORDINAPE_USER_ADDRESS } from '../../../api-lib/config';
import * as mutations from '../../../api-lib/gql/mutations';
import * as queries from '../../../api-lib/gql/queries';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import {
  createCircleSchemaInput,
  composeHasuraActionRequestBody,
} from '../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      input: { payload: input },
      session_variables: sessionVariables,
    } = composeHasuraActionRequestBody(createCircleSchemaInput).parse(req.body);

    if (sessionVariables.hasuraRole !== 'admin') {
      if (input.protocol_id) {
        const isAdmin = await queries.checkAddressAdminInOrg(
          sessionVariables.hasuraAddress,
          input.protocol_id,
          input.protocol_name || '%%'
        );
        if (!isAdmin) {
          return res.status(422).json({
            extensions: [],
            message: `Address is not an admin of any circles under protocol with id ${
              input.protocol_id
            }${
              input.protocol_name ? ` and name '${input.protocol_name}'` : ''
            }`,
            code: '422',
          });
        }
      }
      const ret = await mutations.insertCircleWithAdmin(
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
