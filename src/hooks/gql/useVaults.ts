import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { allVaultFields } from 'lib/gql/mutations';
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
      if (!isFeatureEnabled('vaults')) {
        return;
      }
      const { vaults } = await client.query(
        {
          vaults: [
            {
              where: { chain_id: { _eq: chainId }, org_id: { _eq: orgId } },
            },
            {
              ...allVaultFields,
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
              protocol: {
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
      enabled: !!orgId && !!chainId && isFeatureEnabled('vaults'),
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
