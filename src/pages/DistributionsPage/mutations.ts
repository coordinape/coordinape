import { ValueTypes, useZeusVariables } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { useMutation } from 'react-query';

export function useSaveDistribution() {
  return useMutation(
    async (distribution?: ValueTypes['distributions_insert_input']) => {
      // this is not a hook
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const variables = useZeusVariables({ json: 'jsonb' })({
        json: distribution?.distribution_json,
      });

      const { insert_distributions_one } = await client.mutate(
        {
          insert_distributions_one: [
            {
              object: {
                ...distribution,
                distribution_json: variables.$('json'),
              },
            },
            { id: true },
          ],
        },
        {
          operationName: 'saveDistribution',
          variables,
        }
      );
      return insert_distributions_one;
    }
  );
}

export function useMarkDistributionDone() {
  return useMutation(
    ({
      epochId,
      id,
      txHash,
      circleId,
      vaultId,
      amount,
      symbol,
    }: {
      id: number;
      epochId: number;
      txHash: string;
      vaultId: number;
      circleId: number;
      amount: number;
      symbol: string;
    }) => {
      return client.mutate(
        {
          update_distributions_by_pk: [
            {
              _set: { tx_hash: txHash, distribution_epoch_id: epochId },
              pk_columns: { id },
            },
            { id: true },
          ],
          createVaultTx: [
            {
              payload: {
                tx_type: 'Distribution',
                vault_id: vaultId,
                tx_hash: txHash,
                distribution_id: id,
                circle_id: circleId,
                amount,
                symbol, // already has Yearn prefix
              },
            },
            { id: true },
          ],
          delete_pending_vault_transactions_by_pk: [
            { tx_hash: txHash },
            { __typename: true },
          ],
        },
        { operationName: 'useMarkDistributionDone' }
      );
    }
  );
}

export function useSaveLockedTokenDistribution() {
  return useMutation(async (distribution: any) => {
    const { insert_locked_token_distributions_one } = await client.mutate(
      {
        insert_locked_token_distributions_one: [
          {
            object: {
              token_symbol: distribution.token_symbol,
              token_decimals: distribution.token_decimals,
              token_contract_address: distribution.token_contract_address,
              gift_amount: distribution.gift_amount,
              locked_token_distribution_gifts: {
                data: distribution.locked_token_distribution_gifts,
              },
              epoch_id: distribution.epoch_id,
              chain_id: distribution.chain_id,
            },
          },
          { id: true },
        ],
      },
      {
        operationName: 'createLockedTokenDistribution',
      }
    );
    return insert_locked_token_distributions_one;
  });
}

export function useMarkLockedDistributionDone() {
  return useMutation(({ id, tx_hash }: { id: number; tx_hash: string }) => {
    return client.mutate(
      {
        update_locked_token_distributions_by_pk: [
          {
            _set: { tx_hash },
            pk_columns: { id },
          },
          { id: true },
        ],
      },
      {
        operationName: 'updateLockedTokenDistribution',
      }
    );
  });
}

export function useGiveCsv() {
  return useMutation(
    async ({
      circleId,
      epoch,
      epochId,
    }: {
      circleId: number;
      epoch?: number;
      epochId?: number;
    }) => {
      const { giveCsv } = await client.mutate(
        {
          giveCsv: [
            {
              payload: {
                circle_id: circleId,
                epoch_id: epochId,
                epoch: epoch,
              },
            },
            {
              file: true,
            },
          ],
        },
        {
          operationName: 'giveCsv',
        }
      );
      return giveCsv;
    }
  );
}
