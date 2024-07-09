/* eslint-disable no-console */
import { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime, Settings } from 'luxon';

import { IS_LOCAL_ENV, IS_TEST_ENV } from '../../../api-lib/config';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorLog } from '../../../api-lib/HttpError';
import { getCirclesNoPgiveWithDateFilter } from '../../../api-lib/pgives';
import { Awaited } from '../../../api-lib/ts4.5shim';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import {
  CoSoulArgs,
  getOnChainPGive,
  setBatchOnChainPGive,
  setOnChainPGive,
} from '../../../src/features/cosoul/api/cosoul';
import { getLocalPGIVE } from '../../../src/features/cosoul/api/pgive';
import { storeCoSoulImage } from '../../../src/features/cosoul/art/screenshot';

Settings.defaultZone = 'utc';

const LIMIT_USERS_TO_SYNC = 11;

type CoSoul = Awaited<ReturnType<typeof getCoSoulsToUpdate>>[number];

// This cron ensures that on-chain pgive reflects our local pgive state.
// This should only process each CoSoul once per month
async function handler(req: VercelRequest, res: VercelResponse) {
  if (IS_LOCAL_ENV && !IS_TEST_ENV) {
    return res.status(200).json({
      message: 'This endpoint is disabled in local environment.',
    });
  }

  let success;
  try {
    success = await syncCoSouls();
  } catch (e: any) {
    errorLog(`Error in syncCoSouls cron: ${e}`);
    return res.status(500).json({ success: false, error: e.message });
  }

  return res.status(200).json(success);
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
  const pending = [];
  const errors = [];
  const ignored = [];
  for (const cosoul of cosouls) {
    const localPGIVE = await getLocalPGIVE(cosoul.address);
    const onChainPGIVE = await getOnChainPGive(cosoul.token_id);
    if (localPGIVE !== onChainPGIVE) {
      // update the screenshot
      // this might take a while and might need to be handled in a separate process
      try {
        await storeCoSoulImage(cosoul.token_id);
      } catch (e: any) {
        console.error('failed to screenshot CoSoul ' + cosoul.token_id, e);
        // proceed with setting on-chain pgive
      }
      pending.push({ cosoul, localPGIVE });
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
  let success = false;
  if (pending.length > 0) {
    success = await updateCoSoulOnChain(pending);

    if (!success) {
      errors.push(...pending.map(({ cosoul }) => cosoul.id));
    }
  }

  const message = `${pending.length} CoSouls updated`;
  const status = { message, pending, errors, ignored };
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
    const tx = await setOnChainPGive({ tokenId, amount: totalPGIVE });
    await tx.wait();
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
            checked_at: 'now()',
            synced_at: 'now()',
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

const syncBatchCoSoulToken = async (
  updatedCosouls: { cosoul: CoSoul; localPGIVE: number }[]
) => {
  const pending: CoSoulArgs[] = [];
  const successMessages = [];
  for (const { cosoul, localPGIVE } of updatedCosouls) {
    if (localPGIVE > 0) {
      const pGIVE = Math.floor(localPGIVE);
      pending.push({ tokenId: cosoul.token_id, amount: pGIVE });
      successMessages.push(
        `set PGIVE on chain for tokenId: ${cosoul.token_id} address: ${cosoul.address} to ${localPGIVE}`
      );
    } else {
      console.log(
        'skipping setting on-chain PGIVE because it is 0 for tokenId: ' +
          cosoul.token_id +
          ' address: ' +
          cosoul.address
      );
    }
  }

  if (pending.length > 0) {
    // if only one needs to be updated on chain, we can use setOnChainPGIVE
    if (pending.length === 1) {
      const tx = await setOnChainPGive(pending[0]);
      await tx.wait();
    } else {
      await setBatchOnChainPGive(pending);
    }

    successMessages.forEach(msg => console.log(msg));
  }

  await Promise.allSettled(
    updatedCosouls.map(async ({ cosoul, localPGIVE }) => {
      try {
        await adminClient.mutate(
          {
            update_cosouls_by_pk: [
              {
                pk_columns: {
                  id: cosoul.id,
                },
                _set: {
                  pgive: localPGIVE,
                  checked_at: 'now()',
                  synced_at: 'now()',
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
          'Updated CoSoul with address: ' +
            cosoul.address +
            ' to tokenId: ' +
            cosoul.token_id
        );
      } catch (e: unknown) {
        const message =
          'Error updating Cosoul with addesss ' +
          cosoul.address +
          ' to tokenId: ' +
          cosoul.token_id;
        console.error(message);
        if (e instanceof Error) throw new Error(message);
      }
      return;
    })
  );
};

async function updateCoSoulOnChain(
  cosouls: { cosoul: CoSoul; localPGIVE: number }[]
) {
  try {
    if (cosouls.length === 1) {
      await syncCoSoulToken(
        cosouls[0].cosoul.id,
        cosouls[0].cosoul.address,
        cosouls[0].localPGIVE,
        cosouls[0].cosoul.token_id
      );
    } else {
      await syncBatchCoSoulToken(cosouls);
    }
    return true;
  } catch (e: any) {
    // don't ruin the whole thing, this might be an on-chain issue or temporary setback
    // TODO: send this to sentry
    const failedBatch = cosouls.reduce(
      (accumulator, currentValue, currentIndex) =>
        accumulator +
        `[Cosoul ${currentIndex} with id: ${currentValue.cosoul.id}, tokenId: ${currentValue.cosoul.token_id}, address: 
      ${currentValue.cosoul.address}, and targetPIVE: ${currentValue.localPGIVE}]`,
      ''
    );
    errorLog(
      `error syncing cosouls list ${failedBatch}
      ${e.message ? e.message : e}`
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
            checked_at: 'now()',
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
