import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime, Settings } from 'luxon';

import {
  genPgives,
  getCirclesNoPgiveWithDateFilter,
} from '../../../api-lib/pgives';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import { BACKFILL_TO } from '../../../src/config/env';

Settings.defaultZone = 'utc';

async function handler(req: VercelRequest, res: VercelResponse) {
  /* The backfill part of the code can be removed once backfill is done */

  if (!BACKFILL_TO) {
    res.status(200).json({
      message: `BACKFILL_TO env has not been set yet`,
    });

    return;
  }

  /* Filter for epochs that ended from genesis to the end of the BACKFILL_TO month that pgive data has not been generated yet */

  let startFrom = DateTime.fromISO('2021-01-01');
  let endTo = DateTime.fromISO(BACKFILL_TO).endOf('month');
  const circleIds = await getCirclesNoPgiveWithDateFilter(startFrom, endTo);

  /* If there are still unprocessed circles so it continues to generate historical pgives data */
  if (circleIds.length > 0) {
    await genPgives(circleIds, startFrom, endTo);

    res.status(200).json({
      message: `circle_id ${circleIds.join(
        ','
      )} historical pgives are processed`,
      circleIds,
    });

    return;
  }

  /* This part of the code will not run until the backfill is completed */
  /* Once all circles are processed it will switch to a cron that processes for the previous month's pgive only*/
  const previousMonth = DateTime.local().minus({ months: 1 });
  startFrom = previousMonth.startOf('month');
  if (endTo >= startFrom) {
    res.status(200).json({
      message: `BACKFILL_TO date has not pass yet.`,
      circleIds: [],
    });
    return;
  }

  endTo = previousMonth.endOf('month');

  /* Filter for epochs that ended from the previous month that pgive data has not been generated yet */
  const lastMonthCircleIds = await getCirclesNoPgiveWithDateFilter(
    startFrom,
    endTo
  );

  // The FIRST time this returns 0 , flip a flag on all users whose pgive is different now?????

  await genPgives(lastMonthCircleIds, startFrom, endTo);
  const message =
    lastMonthCircleIds.length > 0
      ? `circle_id ${lastMonthCircleIds.join(',')} of ${previousMonth.month}/${
          previousMonth.year
        } pgives are processed`
      : `all circles have already been processed for the ${previousMonth.month}/${previousMonth.year} period`;
  res.status(200).json({
    message,
    circleIds: lastMonthCircleIds,
  });
  return;
}

export default verifyHasuraRequestMiddleware(handler);
