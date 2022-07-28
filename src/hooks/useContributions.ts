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

// useful for quickly testing that the layout is still correct
// FIXME ideally we'd show this in a Storybook story
const mockData: ContributionUser = {
  address: '0x23f24381cf8518c4fafdaeeac5c0f7c92b7ae678',
  contribution_details_link: 'http://mock.com',
  contributions: [
    { title: 'I did a thing', link: 'http://thing.com' },
    { title: 'And then another', link: 'http://another.com' },
    { title: 'And YET ANOTHER! O_O', link: 'http://yetanother.com' },
    { title: 'Gib me tokens', link: 'http://gib.com' },
    { title: 'I crushed it', link: 'http://crush.com' },
  ],
};

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
                `https://api.deworkxyz.com/integrations/coordinape/${
                  i.data.organizationId
                }?epoch_start=${epoch.start_date}&epoch_end=${
                  epoch.end_date
                }&workspace_ids=${encodeURIComponent(
                  i.data.workspaceIds?.join(',') || ''
                )}`
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
  address: string,
  mock?: boolean
): ContributionUser | undefined {
  const users = useContributionUsers();

  const ret = useMemo(
    () =>
      address
        ? users.find(u => u.address.toLowerCase() === address.toLowerCase())
        : undefined,
    [address, users]
  );

  return mock ? mockData : ret;
}
