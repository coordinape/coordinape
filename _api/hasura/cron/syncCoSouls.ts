/* eslint-disable no-console */
import { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime, Settings } from 'luxon';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorLog } from '../../../api-lib/HttpError';
import { getCirclesNoPgiveWithDateFilter } from '../../../api-lib/pgives';
import { Awaited } from '../../../api-lib/ts4.5shim';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import {
  getOnChainPGIVE,
  getPayload,
  paddedHex,
  PGIVE_SLOT,
  setBatchOnChainPGIVE,
  setOnChainPGIVE,
} from '../../../src/features/cosoul/api/cosoul';
import { getLocalPGIVE } from '../../../src/features/cosoul/api/pgive';
import { storeCoSoulImage } from '../../../src/features/cosoul/art/screenshot';

Settings.defaultZone = 'utc';

// TODO: re-enable when super-mint is done
export const DISABLE_SYNC_ON_CHAIN = false;

const LIMIT_USERS_TO_SYNC = 11; // 11 means 88 bytes payload and 1 for slot. that's to fill 3 bytes32

type CoSoul = Awaited<ReturnType<typeof getCoSoulsToUpdate>>[number];

// This cron ensures that on-chain pgive reflects our local pgive state.
// This should only process each CoSoul once per month
async function handler(req: VercelRequest, res: VercelResponse) {
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
  const updated = [];
  const errors = [];
  const ignored = [];
  for (const cosoul of cosouls) {
    const localPGIVE = await getLocalPGIVE(cosoul.address);
    const onChainPGIVE = await getOnChainPGIVE(cosoul.token_id);
    if (localPGIVE !== onChainPGIVE) {
      // update the screenshot
      // this might take a while and might need to be handled in a separate process
      try {
        await storeCoSoulImage(cosoul.token_id);
      } catch (e: any) {
        console.error('failed to screenshot CoSoul ' + cosoul.token_id, e);
        // proceed with setting on-chain pgive
      }
      updated.push({ cosoul, localPGIVE });
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
  let success = true;
  if (updated.length > 0) {
    // TODO: re-enable when super-mint is done
    if (!DISABLE_SYNC_ON_CHAIN) {
      success = await updateCoSoulOnChain(updated);
    }
  }
  if (!success) {
    errors.push(...updated.map(({ cosoul }) => cosoul.id));
  }
  const message = `${updated.length} CoSouls updated`;
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
  // usually we sync once per month, and make sure we don't sync again
  const previousMonth = DateTime.local().minus({ months: 1 });
  const endOfPreviousMonth = previousMonth.endOf('month');

  // this month (4/24) we have a near-end-of-month checkpoint because we finally implemented bringing CoLinks GIVE into PGIVE
  // TODO: enable this when we are done w/ the new ones
  const useMidMonth = true; //DateTime.local() < DateTime.fromISO('2024-05-01');

  // sync again in 4/24 to include CoLinks GIVE in PGIVE
  const syncAtCheckpoint = useMidMonth
    ? DateTime.fromISO('2024-04-22')
    : endOfPreviousMonth;

  const { cosouls } = await adminClient.query(
    {
      cosouls: [
        {
          limit: LIMIT_USERS_TO_SYNC,
          where: {
            // TODO: this should be temporary, we aren't 100% sure why this is getting set in db before sync
            // but we want to speed things up
            pgive: { _gt: 0 },
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
    const tx = await setOnChainPGIVE(tokenId, totalPGIVE);
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
  let payload = paddedHex(PGIVE_SLOT, 2, true); // 1byte for slot
  const successMessages = [];
  for (const { cosoul, localPGIVE } of updatedCosouls) {
    if (localPGIVE > 0) {
      const pGIVE = Math.floor(localPGIVE);
      // four bytes for pgive and four bytes for tokenId
      payload += getPayload(pGIVE, cosoul.token_id);
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
  // payload is only 0x00 if no pgive needs to be updated on chain
  if (payload.length > 4) {
    // if only one needs to be updated on chain, we can use setOnChainPGIVE
    // 0x00 (4 chracters) plus 4 bytes (8 chracters) for pgive and 4 bytes (8 chracters) for tokenId
    if (payload.length === 20) {
      const tx = await setOnChainPGIVE(
        updatedCosouls[0].cosoul.token_id,
        updatedCosouls[0].localPGIVE
      );
      await tx.wait();
    } else {
      const tx = await setBatchOnChainPGIVE(payload);
      await tx.wait();
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
  updatedCosouls: { cosoul: CoSoul; localPGIVE: number }[]
) {
  try {
    if (updatedCosouls.length === 1) {
      await syncCoSoulToken(
        updatedCosouls[0].cosoul.id,
        updatedCosouls[0].cosoul.address,
        updatedCosouls[0].localPGIVE,
        updatedCosouls[0].cosoul.token_id
      );
    } else {
      await syncBatchCoSoulToken(updatedCosouls);
    }
    return true;
  } catch (e: any) {
    // don't ruin the whole thing, this might be an on-chain issue or temporary setback
    // TODO: send this to sentry
    const failedBatch = updatedCosouls.reduce(
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
