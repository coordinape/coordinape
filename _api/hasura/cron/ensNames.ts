import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import { isValidENS } from '../../../api-lib/validateENS';

async function handler(req: VercelRequest, res: VercelResponse) {
  const ensProfiles = await getEnsProfiles();

  await Promise.all(
    ensProfiles.profiles.map(async profile => {
      const validENS = await isValidENS(profile.name, profile.address);
      if (!validENS) {
        await updateEnsName({ id: profile.id, name: profile.name });
      }
    })
  );

  res.status(200).json({
    success: true,
  });
}

export async function getEnsProfiles() {
  return await adminClient.query(
    {
      profiles: [
        {
          where: {
            name: { _regex: '.eth$' },
          },
        },
        { id: true, address: true, name: true },
      ],
    },
    { operationName: 'cron_getEnsProfiles' }
  );
}

export const updateEnsName = async ({
  id,
  name,
}: {
  id: number;
  name: string;
}) => {
  const modifiedName = name.concat('*');
  try {
    await adminClient.mutate(
      {
        update_profiles_by_pk: [
          {
            _set: { name: modifiedName },
            pk_columns: { id: id },
          },
          { id: true },
        ],
      },
      { operationName: 'cron_updateEnsName' }
    );
  } catch (e: any) {
    if (e.response.errors[0].message.includes('Uniqueness violation')) {
      updateEnsName({ id: id, name: modifiedName });
    } else {
      return Promise.reject(e);
    }
  }
};

export default verifyHasuraRequestMiddleware(handler);
