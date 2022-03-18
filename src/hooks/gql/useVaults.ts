import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

export function useVaults(orgId: number) {
  return useQuery(['vaults-for-org-', orgId], async () => {
    const { vaults } = await client.query({
      vaults: [
        {
          where: { org_id: { _eq: orgId } },
        },
        {
          id: true,
          vault_address: true,
          token_address: true,
          simple_token_address: true,
          symbol: true,
          created_by: true,
          org_id: true,
          decimals: true,
          created_at: true,
          updated_at: true,
        },
      ],
    });

    return vaults;
  });
}
