import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorResponse } from '../../../api-lib/HttpError';
import { sendHourlyReport } from '../../../api-lib/postmark';
import { IN_PRODUCTION } from '../../../src/config/env';

import { EMAIL_FOR_REPORTS } from './dailyReportEmail';

async function handler(req: VercelRequest, res: VercelResponse) {
  if (!IN_PRODUCTION) {
    return res.status(200).json({ success: true });
  }
  // create a date object for one hour ago
  const hourAgo = new Date(
    new Date().setHours(new Date().getHours() - 1)
  ).toISOString();

  try {
    const { hour_new_users } = await adminClient.query(
      {
        __alias: {
          hour_new_users: {
            link_tx_aggregate: [
              {
                where: {
                  buy: { _eq: true },
                  supply: { _eq: 1 },
                  created_at: {
                    _gte: hourAgo,
                  },
                },
              },
              { aggregate: { count: [{}, true] } },
            ],
          },
        },
      },
      {
        operationName: 'postmark__sendHourlyReport',
      }
    );

    const new_users = hour_new_users.aggregate?.count ?? 0;
    if (!new_users) {
      // don't send a report if no activity
      return res.status(200).json({ success: true });
    }

    await sendHourlyReport({
      email: EMAIL_FOR_REPORTS,
      new_users,
    });
    return res.status(200).json({ success: true });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}

// export default verifyHasuraRequestMiddleware(handler);
export default handler;
