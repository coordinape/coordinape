import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime } from 'luxon';
import { z } from 'zod';

import {
  cosouls_constraint,
  cosouls_update_column,
} from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { insertInteractionEvents } from '../../../../api-lib/gql/mutations';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponse } from '../../../../api-lib/HttpError';
import {
  getTokenId,
  PGIVE_SYNC_DURATION_DAYS,
  setOnChainPGIVE,
} from '../../../../src/features/cosoul/api/cosoul';
import { getLocalPGIVE } from '../../../../src/features/cosoul/api/pgive';
import { storeCoSoulImage } from '../../../../src/features/cosoul/art/screenshot';

const syncInput = z
  .object({
    tx_hash: z.string(),
  })
  .strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { payload, session } = await getInput(req, syncInput);

    const address = session.hasuraAddress;
    const tokenId = await getTokenId(address);

    if (!tokenId) {
      // no tokenId on chain, lets clean up
      await burned(address, session.hasuraProfileId);
    } else {
      await minted(address, payload.tx_hash, tokenId, session.hasuraProfileId);
    }

    return res.status(200).json({ token_id: tokenId });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}

export const minted = async (
  address: string,
  txHash: string,
  tokenId: number,
  profileId?: number
) => {
  // make sure its inserted
  const { insert_cosouls_one } = await adminClient.mutate(
    {
      insert_cosouls_one: [
        {
          object: {
            created_tx_hash: txHash,
            token_id: tokenId,
            address: address.toLowerCase(),
          },
          on_conflict: {
            constraint: cosouls_constraint.cosouls_token_id_key,
            update_columns: [
              cosouls_update_column.token_id,
              cosouls_update_column.created_tx_hash,
            ],
          },
        },
        {
          __typename: true,
          synced_at: true,
        },
      ],
    },
    {
      operationName: 'syncCoSoul__insertCoSoul',
    }
  );

  assert(insert_cosouls_one);

  await insertInteractionEvents({
    event_type: 'cosoul_minted',
    profile_id: profileId,
    data: { created_tx_hash: txHash, token_id: tokenId },
  });

  const syncedAt = insert_cosouls_one.synced_at;
  const staleSync =
    !syncedAt ||
    DateTime.fromISO(syncedAt).plus({ days: PGIVE_SYNC_DURATION_DAYS }) <
      DateTime.now();

  if (staleSync) {
    await syncPGive(address, tokenId);
  }
};

const burned = async (address: string, profileId: number) => {
  const { delete_cosouls } = await adminClient.mutate(
    {
      delete_cosouls: [
        {
          where: {
            profile: {
              address: {
                _eq: address,
              },
            },
          },
        },
        {
          returning: {
            token_id: true,
          },
        },
      ],
    },
    {
      operationName: 'syncCoSoul__deleteCoSoul',
    }
  );

  const burnedCosoul = delete_cosouls?.returning.pop();
  assert(burnedCosoul);

  await insertInteractionEvents({
    event_type: 'cosoul_burned',
    profile_id: profileId,
    data: { token_id: burnedCosoul.token_id },
  });
};

async function syncPGive(address: string, tokenId: number) {
  const pgive = await getLocalPGIVE(address);

  await adminClient.mutate(
    {
      update_cosouls: [
        {
          where: {
            token_id: {
              _eq: tokenId,
            },
          },
          _set: {
            pgive: pgive,
            synced_at: new Date().toISOString(),
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'syncCoSouls__syncPgive',
    }
  );
  // this might take a while and might need to be handled in a separate process
  try {
    // eslint-disable-next-line no-console
    console.log('attempting to save screenshot for tokenId:', tokenId);
    await storeCoSoulImage(tokenId);
    // eslint-disable-next-line no-console
    console.log('saved screenshot for tokenId:', tokenId);
  } catch (e: any) {
    console.error('failed to screenshot CoSoul ' + tokenId, e);
    // proceed with setting on-chain pgive
  }
  // set pgive after because this triggers a metadata update + fetch from OpenSea
  await setOnChainPGIVE(tokenId, pgive);
}
