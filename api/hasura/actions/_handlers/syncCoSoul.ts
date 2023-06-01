import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime } from 'luxon';
import { z } from 'zod';

import {
  cosouls_constraint,
  cosouls_update_column,
} from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponse } from '../../../../api-lib/HttpError';
import {
  getOnChainPGIVE,
  getTokenId,
  PGIVE_SYNC_DURATION_DAYS,
  setOnChainPGIVE,
} from '../../../../src/features/cosoul/api/cosoul';
import { getLocalPGive } from '../../../../src/features/cosoul/api/pgive';

const syncInput = z
  .object({
    tokenId: z.number().positive().int(),
    txHash: z.string(),
  })
  .strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { payload, session } = await getInput(req, syncInput);

    const address = session.hasuraAddress;
    const tokenId = await getTokenId(address);

    if (!tokenId) {
      // no tokenId on chain, lets clean up
      await burned(address);
    } else {
      await minted(address, session.hasuraProfileId, payload.txHash, tokenId);
    }

    return res.status(200).json({ tokenId: payload.tokenId });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}

const minted = async (
  address: string,
  profileId: number,
  txHash: string,
  tokenId: number
) => {
  // make sure its inserted
  const { insert_cosouls_one } = await adminClient.mutate(
    {
      insert_cosouls_one: [
        {
          object: {
            created_tx_hash: txHash,
            token_id: tokenId,
            profile_id: profileId,
          },
          on_conflict: {
            constraint: cosouls_constraint.cosouls_pkey,
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
  const syncedAt = insert_cosouls_one.synced_at;
  const staleSync =
    !syncedAt ||
    DateTime.fromISO(syncedAt).plus({ days: PGIVE_SYNC_DURATION_DAYS }) <
      DateTime.now();

  if (staleSync) {
    await syncPGive(address, tokenId);
  }
};

const burned = async (address: string) => {
  await adminClient.mutate(
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
          __typename: true,
        },
      ],
    },
    {
      operationName: 'syncCoSoul__deleteCoSoul',
    }
  );
};

async function syncPGive(address: string, tokenId: number) {
  const pgive = await getLocalPGive(address);
  const onChainPGive = await getOnChainPGIVE(tokenId);
  if (pgive !== onChainPGive) {
    await setOnChainPGIVE(tokenId, pgive);
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
  }
}
