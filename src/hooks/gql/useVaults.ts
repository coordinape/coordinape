import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { getDisplayTokenString } from 'lib/vaults';
import { useQuery } from 'react-query';

import isFeatureEnabled from 'config/features';

import { Awaited } from 'types/shim';

export function useVaults({
  orgId,
  chainId,
}: {
  orgId: number;
  chainId: number;
}) {
  return useQuery(
    ['vaults-for-org-', orgId],
    async () => {
      const { vaults } = await client.query(
        {
          vaults: [
            {
              where: {
                chain_id: { _eq: chainId },
                organization: { id: { _eq: orgId } },
              },
            },
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
              organization: {
                name: true,
              },
            },
          ],
        },
        {
          operationName: 'getVaultsForOrg',
        }
      );
      return vaults;
    },
    {
      enabled: isFeatureEnabled('vaults') && !!orgId && !!chainId,
      select: vaults => {
        return vaults?.map(v => {
          v.symbol = getDisplayTokenString(v);

          return v;
        });
      },
    }
  );
}

export type Vault = Exclude<
  Awaited<ReturnType<typeof useVaults>>['data'],
  undefined
>[0];
