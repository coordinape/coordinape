import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { COORDINAPE_USER_ADDRESS } from '../../../../api-lib/config';
import * as mutations from '../../../../api-lib/gql/mutations';
import * as queries from '../../../../api-lib/gql/queries';
import { UnauthorizedError } from '../../../../api-lib/HttpError';
import { resizeCircleLogo } from '../../../../api-lib/images';
import { ImageUpdater } from '../../../../api-lib/ImageUpdater';
import { Awaited } from '../../../../api-lib/ts4.5shim';
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
    if (input.organization_id) {
      const isAdmin = await queries.checkAddressAdminInOrg(
        sessionVariables.hasuraAddress,
        input.organization_id,
        input.organization_name || '%%'
      );
      if (!isAdmin) {
        throw new UnauthorizedError(
          `Address is not an admin of any circles under organization with id ${
            input.organization_id
          }${
            input.organization_name
              ? ` and name '${input.organization_name}'`
              : ''
          }`
        );
      }
    }

    const updater = new ImageUpdater<
      Awaited<ReturnType<typeof mutations.insertCircleWithAdmin>>
    >(
      resizeCircleLogo,
      createCircle(
        input,
        sessionVariables.hasuraAddress,
        sessionVariables.hasuraProfileId,
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
  circleInput: z.infer<typeof createCircleSchemaInput>,
  userAddress: string,
  userProfileId: number,
  coordinapeAddress: string
) {
  return async (fileName: string) => {
    const circle = await mutations.insertCircleWithAdmin(
      circleInput,
      userAddress,
      coordinapeAddress,
      fileName
    );

    await mutations.insertInteractionEvents({
      event_type: 'circle_create',
      circle_id: circle?.id,
      profile_id: userProfileId,
    });

    return circle;
  };
}
export default verifyHasuraRequestMiddleware(handler);
