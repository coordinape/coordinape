import { getPreviousDistribution } from 'lib/gql/queries';
import { useQuery } from 'react-query';

export function usePreviousDistributions(circleId: number) {
  return useQuery(
    ['previous-distributions-', circleId],
    async () => getPreviousDistribution(circleId),
    { enabled: !!circleId }
  );
}
