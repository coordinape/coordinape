import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';
import { useRecoilState, atom } from 'recoil';

const currentOrgId = atom<number | undefined>({
  key: 'currentOrgId',
  default: undefined,
});

export function useCurrentOrgId() {
  return useRecoilState(currentOrgId);
}

export function useCurrentOrg() {
  const [id] = useCurrentOrgId();

  return useQuery(['org', id], async () => {
    if (!id) {
      const res = await client.query(
        {
          organizations: [{ limit: 1 }, { id: true, name: true }],
        },
        {
          operationName: 'getOrgsWithoutId',
        }
      );
      return res.organizations[0];
    }

    const res = await client.query(
      {
        organizations_by_pk: [{ id }, { id: true, name: true }],
      },
      {
        operationName: 'getOrgWithId',
      }
    );

    return res.organizations_by_pk;
  });
}
