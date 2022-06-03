import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { resizeCircleLogo } from '../../../api-lib/images';
import { ImageUpdater } from '../../../api-lib/ImageUpdater';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import {
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
  uploadOrgImageInput,
} from '../../../src/lib/zod';

const handler = async function (req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload: input },
    // session_variables: sessionVariables,
  } = composeHasuraActionRequestBodyWithSession(
    uploadOrgImageInput,
    HasuraUserSessionVariables
  ).parse(req.body);

  const previousLogo = await getPreviousLogo(input.org_id);

  const updater = new ImageUpdater<{ id: number }>(
    resizeCircleLogo,
    logoUpdater(input.org_id)
  );

  const updatedProfile = await updater.uploadImage(
    input.image_data_base64,
    previousLogo
  );
  return res.status(200).json(updatedProfile);
};

async function getPreviousLogo(id: number): Promise<string | undefined> {
  const { organizations_by_pk } = await adminClient.query(
    {
      organizations_by_pk: [
        {
          id: id,
        },
        { logo: true },
      ],
    },
    {
      operationName: 'updateOrgLogo_getPreviousLogo',
    }
  );

  return organizations_by_pk?.logo;
}

function logoUpdater(id: number) {
  return async (fileName: string) => {
    const mutationResult = await adminClient.mutate(
      {
        update_organizations_by_pk: [
          {
            _set: { logo: fileName },
            pk_columns: { id: id },
          },
          {
            id: true,
          },
        ],
      },
      {
        operationName: 'updateOrgLogo_update',
      }
    );

    if (!mutationResult.update_organizations_by_pk) {
      throw 'circle mutation was not successful';
    }
    return {
      id: mutationResult.update_organizations_by_pk.id,
    };
  };
}

export default verifyHasuraRequestMiddleware(handler);
