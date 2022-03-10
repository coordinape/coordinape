import type { VercelRequest, VercelResponse } from '@vercel/node';

import * as mutations from '../../../api-lib/gql/mutations';
import * as queries from '../../../api-lib/gql/queries';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { nominees } = await queries.getExpiredNominees();

    if (nominees.length > 0) {
      // triggers: hasura/event_triggers/checkNominee*.ts
      const { update_nominees } = await mutations.updateExpiredNominees(
        nominees.map(n => n.id)
      );

      res.status(200).json({ update_nominees });
      return;
    }

    res.status(200).json({ message: 'No updates' });
  } catch (e) {
    res.status(401).json({
      error: '401',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}

export default verifyHasuraRequestMiddleware(handler);
