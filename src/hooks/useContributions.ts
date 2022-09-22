import { useMemo } from 'react';

import { useQueries } from 'react-query';

import { useSelectedCircle } from 'recoilState';

import { useCurrentCircleIntegrations } from './gql/useCurrentCircleIntegrations';

export interface Contribution {
  title: string;
  link: string;
  source?: string;
}

export interface ContributionUser {
  address: string;
  contributions: Contribution[];
}

interface Response {
  users: ContributionUser[];
}

export interface UserContributions {
  // user address as key, contributions as value
  [key: string]: Array<Contribution>;
}

// useful for quickly testing that the layout is still correct
// FIXME ideally we'd show this in a Storybook story
const mockData: UserContributions = {
  ['0x23f24381cf8518c4fafdaeeac5c0f7c92b7ae678']: [
    { title: 'I did a thing', link: 'http://thing.com' },
    { title: 'And then another', link: 'http://another.com' },
    { title: 'And YET ANOTHER! O_O', link: 'http://yetanother.com' },
    { title: 'Gib me tokens', link: 'http://gib.com' },
    { title: 'I crushed it', link: 'http://crush.com' },
  ],
};

export function useContributionUsers(): UserContributions {
  const integrations = useCurrentCircleIntegrations();
  const epoch = useSelectedCircle().circleEpochsStatus.currentEpoch;
  const responses = useQueries(
    epoch && integrations.data
      ? integrations.data
          .filter(
            integration =>
              integration.type === 'dework' || integration.type === 'wonder'
          )
          .map(integration => ({
            queryKey: `circle-integration-contributions-${integration.id}-${epoch.id}`,
            queryFn: () => {
              if (integration.type === 'dework') {
                return fetch(
                  `https://api.deworkxyz.com/integrations/coordinape/${
                    integration.data.organizationId
                  }?epoch_start=${epoch.start_date}&epoch_end=${
                    epoch.end_date
                  }&workspace_ids=${encodeURIComponent(
                    integration.data.workspaceIds?.join(',') || ''
                  )}`
                )
                  .then(res => res.json())
                  .then(res => res as Response);
              }
              if (integration.type === 'wonder') {
                let url = `https://external-api.wonderapp.co/v1/coordinape/contributions?org_id=${integration.data.organizationId}&epoch_start=${epoch.start_date}&epoch_end=${epoch.end_date}`;
                if (integration.data.podIds) {
                  for (const podId of integration.data.podIds) {
                    url += `&pod_ids=${podId}`;
                  }
                }
                return fetch(url)
                  .then(res => res.json())
                  .then(res => res as Response)
                  .then(res => res);
              }
            },
          }))
      : []
  );
  /**
   * responses are individual responses from each integration
   * looping over the responses from various integration stiching together to make a userContributions object that's easier to work eith
   */

  return useMemo(() => {
    const combinedContribution: UserContributions = {};

    responses.map(r => {
      r.data?.users?.map(userContribution => {
        if (!userContribution.address) return;
        const address = userContribution.address.toLowerCase();
        if (address in combinedContribution) {
          combinedContribution[address] = combinedContribution[address].concat(
            userContribution.contributions
          );
        } else {
          combinedContribution[address] = userContribution.contributions;
        }
      });
    });
    return combinedContribution;
  }, [responses]);
}

export function useContributions(
  address: string,
  mock?: boolean
): Array<Contribution> | undefined {
  const userToContribution = useContributionUsers();
  const ret = useMemo(
    () => (address ? userToContribution[address.toLowerCase()] : undefined),
    [address, userToContribution]
  );

  return mock ? mockData[address] : ret;
}
