/* eslint-disable no-console */
import { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { getProvider } from '../../../api-lib/provider';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import { isFeatureEnabled } from '../../../src/config/features';
import { setOnChainPGIVE } from '../../../src/features/cosoul/api/cosoul';
import { getLocalPGive } from '../../../src/features/cosoul/api/pgive';
import { chain } from '../../../src/features/cosoul/chains';
import { Contracts } from '../../../src/features/cosoul/contracts';

// This is a cron job that runs periodically to discover the tokenIds of new CoSouls that were minted in our Web UI
// we know the TX Hash and address but nothing else.
// It discovers the tokenIds and also does the initial sync of the CoSoul's on-chain PGIVE balance
async function handler(req: VercelRequest, res: VercelResponse) {
  await runSyncNewCoSouls();
  res.status(200).json({
    success: true,
  });
}

export const runSyncNewCoSouls = async () => {
  // no-op if cosoul feature is not enabled
  if (!isFeatureEnabled('cosoul')) {
    return;
  }

  const { cosouls } = await adminClient.query(
    {
      cosouls: [
        {
          where: {
            token_id: {
              _is_null: true,
            },
          },
        },
        {
          id: true,
          profile: {
            address: true,
          },
        },
      ],
    },
    {
      operationName: 'syncNewCoSoulsCron__getIncompleteCoSouls',
    }
  );

  const p = getProvider(Number(chain.chainId));
  const contracts = new Contracts(Number(chain.chainId), p, true);

  console.log(`found ${cosouls.length} CoSouls that need tokenId updated`);
  // Try to update them all one by one
  cosouls.forEach(
    async c => await syncOneNewCoSoul(c.id, c.profile.address, contracts)
  );
  console.log('done updating CoSoul tokenIds');
};
// for cosouls that we have not yet discovered the token id for, try to get it

// also write the initial PGIVE balance on chain and to the database
const syncOneNewCoSoul = async (
  id: number,
  address: string,
  contracts: Contracts
) => {
  // for each one of these we need to try to get the balance of the address
  const balance = (await contracts.cosoul.balanceOf(address)).toNumber();

  // if the balance is >0, then we can get the tokenId
  if (balance <= 0) {
    // This isn't ready yet. We should probably log here and also at some point give up on these?
    // FIXME: Delete these from the DB if we failed to sync them after some period of time or somehow give up on these at some point
    console.log(
      'skipping CoSoul with address: ' +
        address +
        ' because it has no balance (yet?)'
    );
    return;
  }

  const tokenId = (
    await contracts.cosoul.tokenOfOwnerByIndex(address, 0)
  ).toNumber();
  if (tokenId <= 0) {
    console.log(
      'skipping CoSoul with address: ' +
        address +
        ' because it has balance but no tokenId (weird)'
    );
    return;
  }

  const totalPGIVE = await getLocalPGive(address);

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
            id: id,
          },
          _set: {
            token_id: tokenId,
            pgive: totalPGIVE,
            synced_at: new Date().toISOString(),
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'syncNewCoSoulsCron__updateCoSoulCache',
    }
  );
  console.log(
    'Updated CoSoul with address: ' + address + ' to tokenId: ' + tokenId
  );
};

export default verifyHasuraRequestMiddleware(handler);
