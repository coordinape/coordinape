import { useQuery } from 'lib/gqty';

import { useSelectedCircleId } from 'recoilState';

export const useCurrentOrg = () => {
  const circleId = useSelectedCircleId();
  const query = useQuery();
  const currentOrg = query.organizations({
    where: { circles: { id: { _eq: circleId } } },
  })[0];

  return currentOrg;
};
