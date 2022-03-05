import type { VercelRequest, VercelResponse } from '@vercel/node';

import { authCircleAdminMiddleware } from '../../../api-lib/circleAdmin';
import { gql } from '../../../api-lib/Gql';
import { ErrorResponse } from '../../../api-lib/HttpError';
import { resizeCircleLogo } from '../../../api-lib/images';
import { ImageUpdater } from '../../../api-lib/ImageUpdater';
import {
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
  uploadCircleImageInput,
} from '../../../src/lib/zod';

const handler = async function (req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload: input },
    // session_variables: sessionVariables,
  } = composeHasuraActionRequestBodyWithSession(
    uploadCircleImageInput,
    HasuraUserSessionVariables
  ).parse(req.body);

  try {
    const previousLogo = await getPreviousLogo(input.circle_id);

    const updater = new ImageUpdater<{ id: number }>(
      resizeCircleLogo,
      logoUpdater(input.circle_id)
    );

    const updatedProfile = await updater.uploadImage(
      input.image_data_base64,
      previousLogo
    );
    return res.status(200).json(updatedProfile);
  } catch (e: any) {
    return ErrorResponse(res, e);
  }
};

async function getPreviousLogo(id: number): Promise<string | undefined> {
  const { circles_by_pk } = await gql.q('query')({
    circles_by_pk: [
      {
        id: id,
      },
      { logo: true },
    ],
  });

  return circles_by_pk?.logo;
}

function logoUpdater(id: number) {
  return async (fileName: string) => {
    const mutationResult = await gql.q('mutation')({
      update_circles_by_pk: [
        {
          _set: { logo: fileName },
          pk_columns: { id: id },
        },
        {
          id: true,
        },
      ],
    });

    if (!mutationResult.update_circles_by_pk) {
      throw 'circle mutation was not successful';
    }
    return {
      id: mutationResult.update_circles_by_pk.id,
    };
  };
}

export default authCircleAdminMiddleware(handler);
