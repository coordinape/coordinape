import { AddressZero } from '@ethersproject/constants';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime, Settings } from 'luxon';

import { Contracts } from '../../../api-lib/contracts';
import {
  vault_tx_types_enum,
  vaults_constraint,
} from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { getProvider } from '../../../api-lib/provider';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

Settings.defaultZone = 'utc';

async function handler(req: VercelRequest, res: VercelResponse) {
  const { pending_vault_transactions: txs } = await adminClient.query({
    pending_vault_transactions: [
      { where: { tx_type: { _eq: vault_tx_types_enum.Vault_Deploy } } },
      {
        __typename: true,
        created_at: true,
        created_by: true,
        tx_hash: true,
        chain_id: true,
        org_id: true,
      },
    ],
  });
  // TODO use Promise.all instead of a for loop
  for (const pendingTx of txs) {
    // verify tx is more than 5 minutes old before operating
    // it's preferrable to do this in the query but date diffs are brittle in
    // hasura
    if (
      DateTime.fromISO(pendingTx.created_at) >
      DateTime.now().minus({ minutes: 5 })
    )
      continue;
    const provider = getProvider(pendingTx.chain_id);
    const tx = await provider.getTransaction(pendingTx.tx_hash);

    // delete the entry if no tx exists or no org id is set
    if (typeof tx == null || typeof pendingTx.org_id == null) {
      await adminClient.mutate({
        delete_pending_vault_transactions_by_pk: [
          { tx_hash: pendingTx.tx_hash },
          { __typename: true },
        ],
      });
      continue;
    }

    // skip if tx not yet mined
    if (typeof tx.blockNumber === null) continue;

    let receipt;
    try {
      receipt = await tx.wait();
    } catch (e) {
      // an error here means the tx failed for some reason
      // we don't care why, so we can just delete it from our table
      await adminClient.mutate({
        delete_pending_vault_transactions_by_pk: [
          { tx_hash: pendingTx.tx_hash },
          { __typename: true },
        ],
      });
      continue;
    }
    const contracts = new Contracts(pendingTx.chain_id, provider);

    // we can only expect one deployment log in a tx based on our app and
    // contract config
    // it's not possible to support multiple deployments in a tx given
    // the context that we have anyway
    const rawLog = receipt.logs
      .filter(log => log.address === contracts.vaultFactory.address)
      .pop();

    if (!rawLog) {
      await adminClient.mutate({
        delete_pending_vault_transactions_by_pk: [
          { tx_hash: pendingTx.tx_hash },
          { __typename: true },
        ],
      });
      continue;
    }

    const log = contracts.vaultFactory.interface.parseLog(rawLog);

    const vault = contracts.getVault(log.args.vault);
    const simple_token_address = await vault.simpleToken();
    const token_address = await vault.token();
    const tokenAddress = [token_address, simple_token_address].find(
      e => e != AddressZero
    );
    if (!tokenAddress) {
      // no valid token address is configured so the vault isn't usable
      // therefore we can ignore it
      await adminClient.mutate({
        delete_pending_vault_transactions_by_pk: [
          { tx_hash: pendingTx.tx_hash },
          { __typename: true },
        ],
      });
      continue;
    }
    const decimals = await contracts.getERC20(tokenAddress).decimals();
    const symbol = await contracts.getERC20(tokenAddress).symbol();
    await adminClient.mutate({
      insert_vaults_one: [
        {
          object: {
            symbol,
            decimals,
            org_id: pendingTx.org_id,
            deployment_block: receipt.blockNumber,
            vault_address: log.args.vault.toLowerCase(),
            chain_id: pendingTx.chain_id,
            created_by: pendingTx.created_by,
            token_address,
            simple_token_address,
          },
          // swallow error if vault already exists in table
          // and delete the pending entry
          on_conflict: {
            constraint: vaults_constraint.vaults_vault_address_key,
            update_columns: [],
          },
        },
        { id: true },
      ],
      delete_pending_vault_transactions_by_pk: [
        { tx_hash: pendingTx.tx_hash },
        { __typename: true },
      ],
    });
  }
  res.status(200).json({ processed_txs: txs });
}

export default verifyHasuraRequestMiddleware(handler);
