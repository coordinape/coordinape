import assert from 'assert';

import type { TransactionReceipt } from '@ethersproject/abstract-provider';
import { AddressZero } from '@ethersproject/constants';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import zipObject from 'lodash/zipObject';
import { DateTime, Settings } from 'luxon';

import { Contracts } from '../../../api-lib/contracts';
import {
  vault_tx_types_enum,
  vaults_constraint,
} from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { getProvider } from '../../../api-lib/provider';
import { Awaited } from '../../../api-lib/ts4.5shim';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

Settings.defaultZone = 'utc';

const assertOrRemove = async (test: any, message: string, hash: string) => {
  if (test) return;
  await adminClient.mutate({
    delete_pending_vault_transactions_by_pk: [
      { tx_hash: hash },
      { __typename: true },
    ],
  });
  throw message;
};

const getPendingTxRecords = async () => {
  const data = await adminClient.query({
    pending_vault_transactions: [
      { where: { tx_type: { _eq: vault_tx_types_enum.Vault_Deploy } } },
      {
        __typename: true,
        created_at: true,
        created_by: true,
        tx_hash: true,
        tx_type: true,
        chain_id: true,
        org_id: true,
        claim_id: true,
      },
    ],
  });
  return data.pending_vault_transactions;
};

type TxRecord = Awaited<ReturnType<typeof getPendingTxRecords>>[0];

const handleTxRecord = async (txRecord: TxRecord) => {
  const { chain_id, tx_hash, tx_type, created_at } = txRecord;

  // verify tx is more than 5 minutes old before operating
  // it's preferable to do this in the query but date diffs are brittle in
  // hasura
  if (DateTime.fromISO(created_at) > DateTime.now().minus({ minutes: 5 }))
    return 'not old enough';

  const provider = getProvider(chain_id);
  const tx = await provider.getTransaction(tx_hash);
  await assertOrRemove(tx, 'no tx found', tx_hash);
  if (typeof tx.blockNumber === null) return 'not yet mined';

  try {
    const receipt = await tx.wait();
    const contracts = new Contracts(chain_id, provider);

    switch (tx_type) {
      case 'Vault_Deploy':
        return handleVaultDeploy(contracts, txRecord, receipt);
      case 'Claim':
        return handleClaim(contracts, txRecord, receipt);
      default:
        throw new Error(`${tx_type} not handled yet`);
    }
  } catch (e: any) {
    // an error here means the tx failed for some reason
    // we don't care why, so we can just delete it from our table
    await assertOrRemove(
      false,
      `error fetching receipt: ${e?.message || e}`,
      tx_hash
    );
  }
};

const handleVaultDeploy = async (
  contracts: Contracts,
  tx: TxRecord,
  receipt: TransactionReceipt
) => {
  const { tx_hash } = tx;

  // we can expect only one deployment log in a tx based on our app and contract
  // config. it's not possible to support multiple deployments in a tx given the
  // context that we have anyway
  const rawLog = receipt.logs
    .filter(log => log.address === contracts.vaultFactory.address)
    .pop();

  await assertOrRemove(rawLog, 'no event log found', tx_hash);
  assert(rawLog);
  const log = contracts.vaultFactory.interface.parseLog(rawLog);
  await assertOrRemove(
    log.name === 'VaultCreated',
    'event name mismatch',
    tx_hash
  );

  const vault = contracts.getVault(log.args.vault);
  const [simple_token_address, token_address] = await Promise.all([
    vault.simpleToken(),
    vault.token(),
  ]);
  const tokenAddress = [token_address, simple_token_address].find(
    e => e != AddressZero
  );
  await assertOrRemove(tokenAddress, 'invalid token address', tx_hash);
  assert(tokenAddress);
  const token = contracts.getERC20(tokenAddress);
  const [decimals, symbol] = await Promise.all([
    token.decimals(),
    token.symbol(),
  ]);
  const addVault = await adminClient.mutate(
    {
      insert_vaults_one: [
        {
          object: {
            symbol,
            decimals,
            org_id: tx.org_id,
            deployment_block: receipt.blockNumber,
            vault_address: log.args.vault.toLowerCase(),
            chain_id: tx.chain_id,
            created_by: tx.created_by,
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
        { tx_hash },
        { __typename: true },
      ],
    },
    { operationName: 'recoverVaultDeploy' }
  );
  return `added vault id ${addVault.insert_vaults_one?.id}`;
};

const handleClaim = async (
  contracts: Contracts,
  tx: TxRecord,
  receipt: TransactionReceipt
) => {
  const { claim_id, tx_hash } = tx;

  const rawLog = receipt.logs
    .filter(log => log.address === contracts.distributor.address)
    .pop();

  await assertOrRemove(rawLog, 'no event log found', tx_hash);
  assert(rawLog);
  const log = contracts.distributor.interface.parseLog(rawLog);
  await assertOrRemove(log.name === 'Claimed', 'event name mismatch', tx_hash);

  const { claims_by_pk: data } = await adminClient.query({
    claims_by_pk: [
      { id: claim_id },
      {
        address: true,
        distribution: {
          vault: { vault_address: true },
          epoch: { circle: { id: true } },
        },
      },
    ],
  });

  await assertOrRemove(data, 'claim not found', tx_hash);
  assert(data);
  const {
    address,
    distribution: { vault, epoch },
  } = data;
  assert(epoch.circle);

  const update = await adminClient.mutate(
    {
      update_claims: [
        {
          _set: {
            txHash: tx_hash,
          },
          where: {
            address: { _eq: address },
            id: { _lte: claim_id },
            distribution: {
              vault: { vault_address: { _eq: vault.vault_address } },
              epoch: { circle: { id: { _eq: epoch.circle.id } } },
            },
          },
        },
        { affected_rows: true },
      ],
    },
    { operationName: 'recoverClaim' }
  );

  return `updated ${update.update_claims?.affected_rows} claims`;
};

async function handler(req: VercelRequest, res: VercelResponse) {
  const txRecords = await getPendingTxRecords();

  const results = await Promise.all(
    txRecords.map(async tx => {
      try {
        return await handleTxRecord(tx);
      } catch (err: any) {
        return `error: ${err?.message || err}`;
      }
    })
  );

  res.status(200).json({
    processed_txs: zipObject(
      txRecords.map(t => t.tx_hash),
      results
    ),
  });
}

export default verifyHasuraRequestMiddleware(handler);
