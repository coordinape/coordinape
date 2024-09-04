/* eslint-disable no-console */
import { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime, Settings } from 'luxon';

import { BE_ALCHEMY_API_KEY, IS_LOCAL_ENV } from '../../../api-lib/config';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorLog } from '../../../api-lib/HttpError';
import { getCirclesNoPgiveWithDateFilter } from '../../../api-lib/pgives';
import { Awaited } from '../../../api-lib/ts4.5shim';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import {
  getOnChainPGive,
  setOnChainPGive,
} from '../../../api-lib/viem/contracts';
import { getLocalPGIVE } from '../../../src/features/cosoul/api/pgive';
import { storeCoSoulImage } from '../../../src/features/cosoul/art/screenshot';
import { chain } from '../../../src/features/cosoul/chains';
import { getReadOnlyClient } from '../../../src/utils/viem/publicClient';

Settings.defaultZone = 'utc';

const LIMIT_USERS_TO_SYNC = 10;

type CoSoul = Awaited<ReturnType<typeof getCoSoulsToUpdate>>[number];

// This cron ensures that on-chain pgive reflects our local pgive state.
// This should only process each CoSoul once per month
async function handler(req: VercelRequest, res: VercelResponse) {
  if (IS_LOCAL_ENV) {
    return res.status(200).json({
      message: 'This endpoint is disabled in local environment.',
    });
  }

  const success = await syncCoSouls();
  res.status(200).json(success);
}

export async function syncCoSouls() {
  // We don't want to run unless historical pgive generation is finished for the previous month
  const needsToRun = await isHistoricalPGiveFinished();
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

  // update each one on-chain if needed, otherwise just update the checked_at column
  const updated = [];
  const errors = [];
  const ignored = [];
  for (const cosoul of cosouls) {
    const localPGIVE = await getLocalPGIVE(cosoul.address);

    const onChainPGIVE = await getOnChainPGive(cosoul.token_id);

    let success = true;
    if (localPGIVE !== Number(onChainPGIVE)) {
      // update the screenshot
      // this might take a while and might need to be handled in a separate process
      try {
        await storeCoSoulImage(cosoul.token_id);
      } catch (e: any) {
        console.error('failed to screenshot CoSoul ' + cosoul.token_id, e);
        // proceed with setting on-chain pgive
      }
      success = await updateCoSoulOnChain(cosoul, localPGIVE);

      if (success) {
        updated.push(cosoul.id);
      } else {
        errors.push(cosoul.id);
      }
    } else {
      ignored.push(cosoul.id);
      console.log(
        'No need to update on-chain PGIVE for tokenId',
        cosoul.token_id,
        'localPgive:',
        localPGIVE,
        'onChainPGIVE:',
        onChainPGIVE
      );
      // update repScore on chain if needed

      // just update the checked at
      await updateCheckedAt(cosoul.id);
    }
  }
  const message = `${cosouls.length} CoSouls updated`;
  const status = { message, updated, errors, ignored };
  console.log(status);
  return status;
}

export async function isHistoricalPGiveFinished() {
  const previousMonth = DateTime.local().minus({ months: 1 });
  const startFrom = previousMonth.startOf('month');
  const endTo = previousMonth.endOf('month');

  /* Filter for circles that are still pending PGIVE calculation for last month */
  const lastMonthCircleIds = await getCirclesNoPgiveWithDateFilter(
    startFrom,
    endTo
  );

  // If no circles are pending PGIVE calculation, we can proceed
  return lastMonthCircleIds.length === 0;
}

const getCoSoulsToUpdate = async () => {
  const previousMonth = DateTime.local().minus({ months: 1 });
  const endOfPreviousMonth = previousMonth.endOf('month');

  const syncAtCheckpoint = endOfPreviousMonth;

  const { cosouls } = await adminClient.query(
    {
      cosouls: [
        {
          limit: LIMIT_USERS_TO_SYNC,
          where: {
            // only update pgive of users who have profiles
            profile: {
              id: {
                _is_null: false,
              },
            },
            _or: [
              {
                checked_at: {
                  _is_null: true,
                },
              },
              {
                checked_at: {
                  _lt: syncAtCheckpoint.toISO(),
                },
              },
            ],
          },
        },
        {
          id: true,
          token_id: true,
          pgive: true,
          address: true,
        },
      ],
    },
    {
      operationName: 'cron__syncCoSouls__getCoSoulsToUpdate',
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
    totalPGIVE = Math.floor(totalPGIVE);
    const txHash = await setOnChainPGive({ tokenId, amount: totalPGIVE });

    const chainId = Number(chain.chainId);
    const publicClient = getReadOnlyClient(chainId, BE_ALCHEMY_API_KEY);

    await publicClient.getTransactionReceipt({
      hash: txHash,
    });

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
      cosoul.address,
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
      } address: ${cosoul.address}}, ${
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
