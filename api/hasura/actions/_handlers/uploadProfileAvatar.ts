import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';

const urlImageInput = z.object({ url: z.string().url() }).strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    payload: input,
    session: { hasuraProfileId },
  } = await getInput(req, urlImageInput);

  const { update_profiles_by_pk } = await adminClient.mutate(
    {
      update_profiles_by_pk: [
        {
          _set: {
            avatar: input.url,
          },
          pk_columns: { id: hasuraProfileId },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'profileUpdateImageMutation',
    },
  );

  return res.status(200).json(update_profiles_by_pk);
}
