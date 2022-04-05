import { getPreviousDistribution } from 'lib/gql/queries';
import { useQuery } from 'react-query';

export function usePreviousDistributions(epochId: number) {
  return useQuery(
    ['previous-distributions-', epochId],
    async () => getPreviousDistribution(epochId),
    { enabled: !!epochId }
  );
}
