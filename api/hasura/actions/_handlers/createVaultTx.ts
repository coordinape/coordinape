import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ethers } from 'ethers';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import { z } from 'zod';

import {
  ValueTypes,
  vault_tx_types_enum,
} from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getPropsWithUserSession } from '../../../../api-lib/handlerHelpers';
import { UnprocessableError } from '../../../../api-lib/HttpError';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    session_variables: { hasuraProfileId, hasuraAddress },
    input: { payload },
  } = getPropsWithUserSession(VaultLogInputSchema, req);
  const actionToLog = VaultLogUnionSchema.parse(payload);

  const validVault = await getVaultForAddress(
    hasuraAddress,
    actionToLog.vault_id
  );
  if (!validVault?.organization.circles.length)
    throw new UnprocessableError(
      `User cannot access Vault ${actionToLog.vault_id}`
    );

  if (actionToLog.tx_type === 'Distribution') {
    const validCircle = validVault.organization.circles.find(
      circle => circle.id === actionToLog.circle_id
    );
    if (!validCircle)
      throw new UnprocessableError(
        `Circle ${actionToLog.circle_id} not linked to Vault ${actionToLog.vault_id}`
      );
    const distributions = await getDistributionForVault(actionToLog);
    if (!distributions.length)
      throw new UnprocessableError(
        `Invalid parameters passed for distribution`
      );
  }
  const result = await logVaultTx({
    ...actionToLog,
    created_by: hasuraProfileId,
    tx_type: (() => {
      switch (actionToLog.tx_type) {
        case 'Deposit':
          return vault_tx_types_enum.Deposit;
        case 'Withdraw':
          return vault_tx_types_enum.Withdraw;
        case 'Distribution':
          return vault_tx_types_enum.Distribution;
        default:
          throw new Error('Invalid Vault Transaction Type');
      }
    })(),
  });
  return res.json(result);
}

export default verifyHasuraRequestMiddleware(handler);

export const logVaultTx = async (
  txInfo: ValueTypes['vault_transactions_insert_input'] &
    ValueTypes['LogVaultTxInput']
) => {
  const { insert_vault_transactions_one } = await adminClient.mutate(
    {
      insert_vault_transactions_one: [
        { object: omit(txInfo, ['amount', 'symbol']) },
        { id: true },
      ],
      insert_interaction_events_one: [
        {
          object: {
            event_type: `vault_${txInfo.tx_type?.toLowerCase()}`,
            profile_id: txInfo.created_by,
            data: pick(txInfo, [
              'vault_id',
              'amount',
              'symbol',
              'tx_hash',
              'circle_id',
              'distribution_id',
            ]),
          },
        },
        { __typename: true },
      ],
    },
    { operationName: 'addVaultTransaction' }
  );
  assert(insert_vault_transactions_one);
  return insert_vault_transactions_one;
};

const VaultLogEnum = z.enum(['Deposit', 'Withdraw', 'Distribution']);

const zBytes32 = z.string().refine(val => ethers.utils.isHexString(val, 32));

const VaultLogInputSchema = z.object({
  tx_type: VaultLogEnum,
  tx_hash: zBytes32,
  vault_id: z.number().min(0),
  distribution_id: z.number().min(0).optional(),
  circle_id: z.number().min(0).optional(),
  amount: z.number(),
  symbol: z.string(),
});

const DepositLogInputSchema = z
  .object({
    tx_type: z.literal(VaultLogEnum.enum.Deposit),
    vault_id: z.number().min(0),
    tx_hash: zBytes32,
    amount: z.number(),
    symbol: z.string(),
  })
  .strict();

const WithdrawLogInputSchema = z
  .object({
    tx_type: z.literal(VaultLogEnum.enum.Withdraw),
    vault_id: z.number().min(0),
    tx_hash: zBytes32,
    amount: z.number(),
    symbol: z.string(),
  })
  .strict();

const DistributionLogInputSchema = z
  .object({
    tx_type: z.literal(VaultLogEnum.enum.Distribution),
    tx_hash: zBytes32,
    vault_id: z.number().min(1),
    circle_id: z.number().min(1),
    distribution_id: z.number().min(1),
    amount: z.number(),
    symbol: z.string(),
  })
  .strict();

const VaultLogUnionSchema = z.discriminatedUnion('tx_type', [
  DepositLogInputSchema,
  WithdrawLogInputSchema,
  DistributionLogInputSchema,
]);

async function getVaultForAddress(address: string, vaultId: number) {
  const result = await adminClient.query({
    vaults_by_pk: [
      {
        id: vaultId,
      },
      {
        organization: {
          circles: [
            { where: { users: { address: { _eq: address } } } },
            { id: true },
          ],
        },
      },
    ],
  });
  return result.vaults_by_pk;
}

async function getDistributionForVault({
  vault_id,
  tx_hash,
  distribution_id,
}: {
  vault_id: number;
  tx_hash: string;
  distribution_id: number;
}) {
  const result = await adminClient.query({
    distributions: [
      {
        where: {
          id: { _eq: distribution_id },
          tx_hash: { _eq: tx_hash },
          vault_id: { _eq: vault_id },
        },
      },
      { __typename: true },
    ],
  });
  return result.distributions;
}
