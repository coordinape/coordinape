import { useMemo } from 'react';

import { useQueries } from 'react-query';

import { useSelectedCircle } from 'recoilState';

import { useCurrentCircleIntegrations } from './gql/useCurrentCircleIntegrations';

interface Contribution {
  title: string;
  link: string;
}

export interface ContributionUser {
  address: string;
  contributions: Contribution[];
  contribution_details_link: string;
}

interface Response {
  users: ContributionUser[];
}

export function useContributionUsers(): ContributionUser[] {
  const integrations = useCurrentCircleIntegrations();
  const epoch = useSelectedCircle().circleEpochsStatus.currentEpoch;

  const responses = useQueries(
    epoch && integrations.data
      ? integrations.data
          .filter(i => i.type === 'dework')
          .map(i => ({
            queryKey: `circle-integration-contributions-${i.id}-${epoch.id}`,
            queryFn: () =>
              fetch(
                `https://api.dework.xyz/integrations/coordinape/${i.data.organizationId}?epoch_start=${epoch.start_date}&epoch_end=${epoch.end_date}`
              )
                .then(res => res.json())
                .then(res => res as Response),
          }))
      : []
  );

  return useMemo(
    () => responses.map(r => r.data?.users ?? []).flat(),
    [responses]
  );
}

export function useContributions(
  address: string
): ContributionUser | undefined {
  const users = useContributionUsers();
  return useMemo(
    () => users.find(u => u.address.toLowerCase() === address.toLowerCase()),
    [address, users]
  );
}
