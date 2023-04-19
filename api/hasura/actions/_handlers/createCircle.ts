import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import * as mutations from '../../../../api-lib/gql/mutations';
import * as queries from '../../../../api-lib/gql/queries';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { UnauthorizedError } from '../../../../api-lib/HttpError';
import { resizeCircleLogo } from '../../../../api-lib/images';
import { ImageUpdater } from '../../../../api-lib/ImageUpdater';
import { Awaited } from '../../../../api-lib/ts4.5shim';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';
import { zCircleName, zUsername } from '../../../../src/lib/zod/formHelpers';

const createCircleSchemaInput = z
  .object({
    user_name: zUsername,
    circle_name: zCircleName,
    image_data_base64: z.string().optional(),
    organization_id: z.number().int().positive().optional(),
    organization_name: z.string().min(3).max(255).optional(),
    contact: z.string().min(3).max(255).optional(),
  })
  .strict()
  .refine(
    data => data.organization_name || data.organization_id,
    'Either Protocol name should be filled in or a Protocol should be selected.'
  );

async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload, session } = getInput(req, createCircleSchemaInput);

  if (payload.organization_id) {
    const isAdmin = await queries.checkAddressAdminInOrg(
      session.hasuraAddress,
      payload.organization_id,
      payload.organization_name || '%%'
    );
    if (!isAdmin) {
      throw new UnauthorizedError(
        `Address is not an admin of any circles under organization with id ${
          payload.organization_id
        }${
          payload.organization_name
            ? ` and name '${payload.organization_name}'`
            : ''
        }`
      );
    }
  }

  const createCircle = createCircleFn(
    payload,
    session.hasuraAddress,
    session.hasuraProfileId
  );

  const updater = new ImageUpdater<
    Awaited<ReturnType<typeof mutations.insertCircleWithAdmin>>
  >(resizeCircleLogo, createCircle);

  let ret;
  if (payload.image_data_base64) {
    ret = await updater.uploadImage(payload.image_data_base64, undefined);
  } else {
    ret = await createCircle(null);
  }

  return res.status(200).json(ret);
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
