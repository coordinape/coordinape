import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { COORDINAPE_USER_ADDRESS } from '../../../api-lib/config';
import { gql } from '../../../api-lib/Gql';
import { ValueTypes } from '../../../src/lib/gql/zeusHasuraAdmin';
import { createCircleSchemaInput } from '../../../src/lib/zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const input: ValueTypes['create_circle_input'] = req.body.input.object;
  try {
    createCircleSchemaInput.parse(input);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(422).json({
        extensions: err.issues,
        message: 'Invalid input',
        code: '422',
      });
    }
  }

  try {
    if (input.protocol_id) {
      const isAdmin = await gql.checkAddressAdminInOrg(
        req.body.session_variables['x-hasura-address'],
        input.protocol_id
      );
      if (!isAdmin) {
        return res.status(422).json({
          extensions: [],
          message: 'Address is not an admin of any circles under this protocol',
          code: '422',
        });
      }
    }
    const ret: ValueTypes['create_circle_response'] =
      await gql.insertCircleWithAdmin(
        input,
        req.body.session_variables['x-hasura-address'],
        COORDINAPE_USER_ADDRESS
      );
    return res.status(200).json(ret);
  } catch (e) {
    return res.status(401).json({
      error: '401',
      message: e.message || 'Unexpected error',
    });
  }
}
