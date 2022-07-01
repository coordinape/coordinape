import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  ValueTypes,
  vault_tx_types_enum,
} from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';
import {
  VaultLogInputSchema,
  VaultLogUnionSchema,
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
} from '../../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    session_variables: { hasuraProfileId },
    input: { payload },
  } = composeHasuraActionRequestBodyWithSession(
    VaultLogInputSchema,
    HasuraUserSessionVariables
  ).parse(req.body);
  const actionToLog = VaultLogUnionSchema.parse(payload);
  switch (actionToLog.tx_type) {
    case 'Deposit': {
      const result = await logVaultTx({
        ...actionToLog,
        created_by: hasuraProfileId,
        tx_type: vault_tx_types_enum.Deposit,
      });
      return res.json(result);
    }
    case 'Withdraw': {
      const result = await logVaultTx({
        ...actionToLog,
        created_by: hasuraProfileId,
        tx_type: vault_tx_types_enum.Withdraw,
      });
      return res.json(result);
    }
    case 'Distribution': {
      const result = await logVaultTx({
        ...actionToLog,
        created_by: hasuraProfileId,
        tx_type: vault_tx_types_enum.Distribution,
      });
      return res.json(result);
    }
  }
  throw new Error('Invalid VaultTransaction Type');
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
