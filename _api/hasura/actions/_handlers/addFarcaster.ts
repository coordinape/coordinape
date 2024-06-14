import type { VercelRequest, VercelResponse } from '@vercel/node';

import { autoConnectFarcasterAccount } from '../../../../api-lib/farcaster/autoConnectFarcasterAccount.ts';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';

export const errorMessage = (res: VercelResponse, msg: string) => {
  console.error(msg);
  return res.status(200).json({ success: false, error: msg });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      session: { hasuraProfileId },
    } = await getInput(req);

    const { currentUser } = await adminClient.query(
      {
        __alias: {
          currentUser: {
            profiles_by_pk: [
              {
                id: hasuraProfileId,
              },
              {
                id: true,
                address: true,
                farcaster_account: {
                  fid: true,
                },
              },
            ],
          },
        },
      },
      {
        operationName: 'addFarcaster__fetchCurrentUser',
      }
    );

    if (!currentUser) {
      return errorMessage(res, `currentUser not found`);
    }

    try {
      const fp = await autoConnectFarcasterAccount(
        currentUser.address,
        hasuraProfileId
      );
      if (!fp) {
        throw new Error(
          `No farcaster account found with your CoLinks address (custody or verified)`
        );
      }
    } catch (e: any) {
      return errorMessage(res, e.message);
    }

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return errorMessage(res, `error connecting account: ` + e);
  }
}
