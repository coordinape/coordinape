import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  ValueTypes,
  vault_tx_types_enum,
} from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import {
  getDistributionForVault,
  getVaultForAddress,
} from '../../../../api-lib/gql/queries';
import { UnprocessableError } from '../../../../api-lib/HttpError';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';
import {
  VaultLogInputSchema,
  VaultLogUnionSchema,
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
} from '../../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    session_variables: { hasuraProfileId, hasuraAddress },
    input: { payload },
  } = composeHasuraActionRequestBodyWithSession(
    VaultLogInputSchema,
    HasuraUserSessionVariables
  ).parse(req.body);
  const actionToLog = VaultLogUnionSchema.parse(payload);

  const validVault = await getVaultForAddress(
    hasuraAddress,
    actionToLog.vault_id
  );
  if (!validVault?.protocol.circles.length)
    throw new UnprocessableError(
      `User cannot access Vault ${actionToLog.vault_id}`
    );

  if (actionToLog.tx_type === 'Distribution') {
    const validCircle = validVault.protocol.circles.find(
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
  txInfo: ValueTypes['vault_transactions_insert_input']
) => {
  const { insert_vault_transactions_one } = await adminClient.mutate(
    {
      insert_vault_transactions_one: [{ object: txInfo }, { id: true }],
    },
    { operationName: 'addVaultTransaction' }
  );
  assert(insert_vault_transactions_one);
  return insert_vault_transactions_one;
};
