import { Magic } from '@magic-sdk/admin';
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorLog } from '../../../api-lib/HttpError';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

const API_KEY = process.env.SECRET_MAGIC_API_KEY;

async function handler(req: VercelRequest, res: VercelResponse) {
  //check if names are used by other coordinape users
  const magic = await Magic.init(API_KEY);
  magic.users.getMetadataByPublicAddress;
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            _and: [{ connector: { _eq: 'magic' } }, { _not: { emails: {} } }],
          },
        },
        {
          id: true,
          address: true,
        },
      ],
    },
    { operationName: 'updateMagicEmails__getProfileAddress' }
  );

  let emails;
  try {
    emails = await Promise.all(
      profiles.map(async p => {
        const { email } = await magic.users.getMetadataByPublicAddress(
          p.address
        );
        return { profile_id: p.id, email, primary: true, verified_at: 'now()' };
      })
    );
  } catch (e: unknown) {
    if (e instanceof Error)
      errorLog(`Failed to fetch users emails` + e.message);
    res.status(500).json({
      error: '500',
      message: (e as Error).message || 'Unexpected error',
    });
  }

  if (emails && emails.length > 0)
    await adminClient.mutate(
      {
        insert_emails: [{ objects: emails }, { returning: { email: true } }],
      },
      { operationName: 'updateMagicEmails__insertNewEmails' }
    );

  res.status(200).json({
    success: true,
  });
}
export default verifyHasuraRequestMiddleware(handler);
