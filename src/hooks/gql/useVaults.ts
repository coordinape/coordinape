import { client } from 'lib/gql/client';
import { allVaultFields } from 'lib/gql/mutations';
import { useQuery } from 'react-query';

import { Awaited } from 'types/shim';

export function useVaults(orgId: number | undefined) {
  return useQuery(
    ['vaults-for-org-', orgId],
    async () => {
      const { vaults } = await client.query({
        vaults: [
          {
            where: { org_id: { _eq: orgId } },
          },
          allVaultFields,
        ],
      });
      return vaults;
    },
    { enabled: !!orgId }
  );
}

export type Vault = Exclude<
  Awaited<ReturnType<typeof useVaults>>['data'],
  undefined
>[0];
