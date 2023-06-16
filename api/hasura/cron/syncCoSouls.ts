/* eslint-disable no-console */
import { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime } from 'luxon';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorLog } from '../../../api-lib/HttpError';
import { getCirclesNoPgiveWithDateFilter } from '../../../api-lib/pgives';
import { Awaited } from '../../../api-lib/ts4.5shim';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import {
  getOnChainPGIVE,
  setOnChainPGIVE,
} from '../../../src/features/cosoul/api/cosoul';
import { getLocalPGive } from '../../../src/features/cosoul/api/pgive';

const usersToSyncAtOnce = 10;
type CoSoul = Awaited<ReturnType<typeof getCoSoulsToUpdate>>[number];

// This cron ensures that on-chain pgive reflects our local pgive state.
// This should only process each CoSoul once per month
async function handler(req: VercelRequest, res: VercelResponse) {
  const success = await syncCoSouls();
  res.status(200).json(success);
}

export async function syncCoSouls() {
  // We don't want to run unless historical pgive generation is finished for the previous month
  const needsToRun = isHistoricalPGiveFinished();
  if (!needsToRun) {
    // we don't need to run this cron yet
    const message = 'Historical PGIVE is not finished yet';
    console.log(message);
    return { message };
  }

  // figure out which cosouls haven't been checked yet this month
  const cosouls = await getCoSoulsToUpdate();
  if (cosouls.length === 0) {
    const message = 'No CoSouls to update';
    console.log(message);
    return { message };
  }

  // update each one on-chain if needed, otherwise just updated the checked_at column
  const updated = [];
  const errors = [];
  for (const cosoul of cosouls) {
    const localPGIVE = await getLocalPGive(cosoul.profile.address);
    const onChainPGIVE = await getOnChainPGIVE(cosoul.token_id);
    let success = true;
    if (localPGIVE !== onChainPGIVE) {
      success = await updateCoSoulOnChain(cosoul, localPGIVE);
    } else {
      // just update the checked at
      await updateCheckedAt(cosoul.id);
    }
    if (success) {
      updated.push(cosoul.id);
    } else {
      errors.push(cosoul.id);
    }
  }
  const message = `${cosouls.length} CoSouls updated`;
  return { message, updated, errors };
}

export async function isHistoricalPGiveFinished() {
  const previousMonth = DateTime.local().minus({ months: 1 });
  const startFrom = previousMonth.startOf('month');
  const endTo = previousMonth.endOf('month');

  /* Filter for epochs that ended from the previous month that pgive data has not been generated yet */
  const lastMonthCircleIds = await getCirclesNoPgiveWithDateFilter(
    startFrom,
    endTo
  );

  return lastMonthCircleIds.length === 0;
}

const getCoSoulsToUpdate = async () => {
  const previousMonth = DateTime.local().minus({ months: 1 });
  const endOfPreviousMonth = previousMonth.endOf('month');

  const { cosouls } = await adminClient.query(
    {
      cosouls: [
        {
          limit: usersToSyncAtOnce,
          where: {
            token_id: {
              _is_null: false,
            },
            _or: [
              {
                checked_at: {
                  _is_null: true,
                },
              },
              {
                checked_at: {
                  _lt: endOfPreviousMonth.toISO(),
                },
              },
            ],
          },
        },
        {
          id: true,
          token_id: true,
          profile_id: true,
          pgive: true,
          profile: {
            address: true,
          },
        },
      ],
    },
    {
      operationName: '',
    }
  );
  return cosouls;
};

const syncCoSoulToken = async (
  coSoulId: number,
  address: string,
  totalPGIVE: number,
  tokenId: number
) => {
  if (totalPGIVE > 0) {
    await setOnChainPGIVE(tokenId, totalPGIVE);
    console.log(
      'set PGIVE on chain for tokenId: ' +
        tokenId +
        ' address: ' +
        address +
        ' to ' +
        totalPGIVE
    );
  } else {
    console.log(
      'skipping setting on-chain PGIVE because it is 0 for tokenId: ' +
        tokenId +
        ' address: ' +
        address
    );
  }

  await adminClient.mutate(
    {
      update_cosouls_by_pk: [
        {
          pk_columns: {
            id: coSoulId,
          },
          _set: {
            pgive: totalPGIVE,
            checked_at: new Date().toISOString(),
            synced_at: new Date().toISOString(),
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'cron__updateCoSoulCache',
    }
  );
  console.log(
    'Updated CoSoul with address: ' + address + ' to tokenId: ' + tokenId
  );
};

async function updateCoSoulOnChain(cosoul: CoSoul, totalPGIVE: number) {
  try {
    await syncCoSoulToken(
      cosoul.id,
      cosoul.profile.address,
      totalPGIVE,
      cosoul.token_id
    );
    return true;
  } catch (e: any) {
    // don't ruin the whole thing, this might be an on-chain issue or temporary setback
    // TODO: send this to sentry
    errorLog(
      `error syncing cosoul id: ${cosoul.id} tokenId: ${
        cosoul.token_id
      } address: ${cosoul.profile.address}}, ${
        e.message ? e.message : e
      } with targetPIVE: ${totalPGIVE}`
    );
    return false;
  }
}

const updateCheckedAt = async (id: number) =>
  adminClient.mutate(
    {
      update_cosouls_by_pk: [
        {
          pk_columns: {
            id,
          },
          _set: {
            checked_at: DateTime.local().toISO(),
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'syncCoSoulCron__updateCheckedAt',
    }
  );

export default verifyHasuraRequestMiddleware(handler);
