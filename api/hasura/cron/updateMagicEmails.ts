import { assert } from 'console';

import { Magic } from '@magic-sdk/admin';
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { IS_LOCAL_ENV } from '../../../api-lib/config';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorLog } from '../../../api-lib/HttpError';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

const API_KEY = process.env.MAGIC_SECRET_API_KEY;

async function handler(req: VercelRequest, res: VercelResponse) {
  if (!API_KEY && IS_LOCAL_ENV) {
    res.status(200).json({
      skipped: true,
    });
    return;
  }

  assert(API_KEY, 'MAGIC_SECRET_API_KEY is missing');
  const magic = await Magic.init(API_KEY);
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            _and: [{ connector: { _eq: 'magic' } }, { _not: { emails: {} } }],
          },
          limit: 20,
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

    if (typeof e === 'object' && e !== null && 'data' in e) {
      // eslint-disable-next-line no-console
      console.log({ data: (e as { data: unknown }).data });
    }

    res.status(500).json({
      error: '500',
      message: (e as Error).message || 'Unexpected error',
    });
    return;
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
  return;
}
export default verifyHasuraRequestMiddleware(handler);
