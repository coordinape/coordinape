import { useQuery } from 'lib/gqty';

import { useSelectedCircle } from 'recoilState';

export const useCurrentOrg = () => {
  const { circleId } = useSelectedCircle();
  const query = useQuery();
  const currentOrg = query
    .organizations({ where: { circles: { id: { _eq: circleId } } } })
    .map(org => ({
      id: org.id,
      name: org.name,
    }))[0];

  return currentOrg;
};
