import { useQuery } from 'react-query';

import { client } from '../../lib/gql/client';
import { useSelectedCircle } from '../../recoilState';

export function useCurrentOrg() {
  const id = useSelectedCircle().circle.protocol_id;

  return useQuery(['org', id], async () => {
    const res = await client.query({
      organizations_by_pk: [{ id }, { id: true, name: true }],
    });

    return res.organizations_by_pk;
  });
}
