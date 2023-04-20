import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { resizeCircleLogo } from '../../../../api-lib/images';
import { ImageUpdater } from '../../../../api-lib/ImageUpdater';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';

const uploadOrgImageInput = z
  .object({ org_id: z.number(), image_data_base64: z.string() })
  .strict();

const handler = async function (req: VercelRequest, res: VercelResponse) {
  const { payload } = await getInput(req, uploadOrgImageInput, {
    allowAdmin: true,
  });

  const previousLogo = await getPreviousLogo(payload.org_id);

  const updater = new ImageUpdater<{ id: number }>(
    resizeCircleLogo,
    logoUpdater(payload.org_id)
  );

  const updatedProfile = await updater.uploadImage(
    payload.image_data_base64,
    previousLogo
  );
  return res.status(200).json(updatedProfile);
};

async function getPreviousLogo(id: number): Promise<string | undefined> {
  const { organizations_by_pk } = await adminClient.query(
    { organizations_by_pk: [{ id }, { logo: true }] },
    { operationName: 'updateOrgLogo_getPreviousLogo' }
  );

  return organizations_by_pk?.logo;
}

function logoUpdater(id: number) {
  return async (fileName: string) => {
    const mutationResult = await adminClient.mutate(
      {
        update_organizations_by_pk: [
          { _set: { logo: fileName }, pk_columns: { id: id } },
          { id: true },
        ],
      },
      { operationName: 'updateOrgLogo_update' }
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
