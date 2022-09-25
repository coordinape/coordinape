import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';

export const getVaultAndTransactions = async (address: string | undefined) => {
  const result = await client.query(
    {
      vaults: [
        { where: { vault_address: { _eq: address } } },
        {
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
          vault_transactions: [
            { order_by: [{ id: order_by.asc }] },
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
                gift_amount: true,
                fixed_amount: true,
                epoch: {
                  start_date: true,
                  end_date: true,
                  number: true,
                  circle: { name: true },
                },
              },
            },
          ],
          organization: {
            name: true,
          },
        },
      ],
    },
    { operationName: 'getVault' }
  );
  const vault = result.vaults.pop();
  if (!vault) throw new Error(`No Vault for address ${address}`);
  return vault;
};
