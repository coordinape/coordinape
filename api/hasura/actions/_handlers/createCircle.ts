import type { VercelRequest, VercelResponse } from '@vercel/node';

import { COORDINAPE_USER_ADDRESS } from '../../../../api-lib/config';
import * as mutations from '../../../../api-lib/gql/mutations';
import * as queries from '../../../../api-lib/gql/queries';
import { UnauthorizedError } from '../../../../api-lib/HttpError';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';
import {
  createCircleSchemaInput,
  composeHasuraActionRequestBody,
} from '../../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
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
        throw new UnauthorizedError(
          `Address is not an admin of any circles under protocol with id ${
            input.protocol_id
          }${input.protocol_name ? ` and name '${input.protocol_name}'` : ''}`
        );
      }
    }
    const ret = await mutations.insertCircleWithAdmin(
      input,
      sessionVariables.hasuraAddress,
      COORDINAPE_USER_ADDRESS
    );

    return res.status(200).json(ret);
  }
}

export default verifyHasuraRequestMiddleware(handler);
