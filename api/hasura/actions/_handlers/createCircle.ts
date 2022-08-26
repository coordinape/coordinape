import type { VercelRequest, VercelResponse } from '@vercel/node';

import { COORDINAPE_USER_ADDRESS } from '../../../../api-lib/config';
import * as mutations from '../../../../api-lib/gql/mutations';
import * as queries from '../../../../api-lib/gql/queries';
import { UnauthorizedError } from '../../../../api-lib/HttpError';
import { resizeCircleLogo } from '../../../../api-lib/images';
import { ImageUpdater } from '../../../../api-lib/ImageUpdater';
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

    const updater = new ImageUpdater<
      | {
          protocol_id: number;
          name: string;
          id: any;
          alloc_text?: string | undefined;
          auto_opt_out: boolean;
          default_opt_in: boolean;
          min_vouches: number;
          nomination_days_limit: number;
          only_giver_vouch: boolean;
          team_sel_text?: string | undefined;
          team_selection: boolean;
          vouching: boolean;
          vouching_text?: string | undefined;
          logo?: string | undefined;
        }
      | undefined
    >(
      resizeCircleLogo,
      createCircle(
        input,
        sessionVariables.hasuraAddress,
        COORDINAPE_USER_ADDRESS
      )
    );

    let ret;
    if (input.image_data_base64) {
      ret = await updater.uploadImage(input.image_data_base64, undefined);
    } else {
      ret = await mutations.insertCircleWithAdmin(
        input,
        sessionVariables.hasuraAddress,
        COORDINAPE_USER_ADDRESS,
        null
      );
    }

    return res.status(200).json(ret);
  }
}

function createCircle(
  circleInput: any,
  userAddress: string,
  coordinapeAddress: string
) {
  return async (fileName: string) => {
    return await mutations.insertCircleWithAdmin(
      circleInput,
      userAddress,
      coordinapeAddress,
      fileName
    );
  };
}
export default verifyHasuraRequestMiddleware(handler);
