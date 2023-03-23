import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

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

    const createCircle = createCircleFn(
      input,
      sessionVariables.hasuraAddress,
      sessionVariables.hasuraProfileId
    );

    const updater = new ImageUpdater<
      Awaited<ReturnType<typeof mutations.insertCircleWithAdmin>>
    >(resizeCircleLogo, createCircle);

    let ret;
    if (input.image_data_base64) {
      ret = await updater.uploadImage(input.image_data_base64, undefined);
    } else {
      ret = await createCircle(null);
    }

    return res.status(200).json(ret);
  }
}

function createCircleFn(
  circleInput: z.infer<typeof createCircleSchemaInput>,
  userAddress: string,
  userProfileId: number
) {
  return async (fileName: string | null) => {
    const circle = await mutations.insertCircleWithAdmin(
      circleInput,
      userAddress,
      userProfileId,
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
