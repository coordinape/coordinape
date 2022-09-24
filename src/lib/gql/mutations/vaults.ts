import { ValueTypes } from '../__generated__/zeus';
import { client } from '../client';

// Warning: this pattern of constructing ad-hoc ValueTypes selections
// and passing them into various queries does not work for array
// relationships in Zeus. These need to be assembled inline
// with the query or explicitly typed. It's interesting that typing or
// casting this object causes typechecking issues
export const allVaultFields = {
  id: true,
  created_at: true,
  created_by: true,
  decimals: true,
  simple_token_address: true,
  symbol: true,
  token_address: true,
  updated_at: true,
  vault_address: true,
  chain_id: true,
  deployment_block: true,
};

export const addVault = (
  vault: ValueTypes['CreateVaultInput'],
  pendingTxHash: string
) =>
  client.mutate(
    {
      createVault: [
        { payload: vault },
        {
          vault: {
            ...allVaultFields,
            organization: {
              name: true,
            },
            vault_transactions: [
              {},
              {
                tx_hash: true,
                tx_type: true,
                created_at: true,
                profile: {
                  address: true,
                  users: [{}, { circle_id: true, name: true }],
                },
                distribution: {
                  claims: [{}, { profile_id: true }],
                  fixed_amount: true,
                  gift_amount: true,
                  epoch: {
                    start_date: true,
                    end_date: true,
                    number: true,
                    circle: { name: true },
                  },
                },
              },
            ],
          },
        },
      ],
      delete_pending_vault_transactions_by_pk: [
        { tx_hash: pendingTxHash },
        { __typename: true },
      ],
    },
    { operationName: 'addVault' }
  );

export const addVaultTx = (vaultTx: ValueTypes['LogVaultTxInput']) =>
  client.mutate({
    createVaultTx: [{ payload: vaultTx }, { __typename: true }],
  });

export async function savePendingVaultTx(
  input: ValueTypes['pending_vault_transactions_insert_input']
) {
  client.mutate({
    insert_pending_vault_transactions_one: [
      { object: { ...input } },
      { __typename: true },
    ],
  });
}
