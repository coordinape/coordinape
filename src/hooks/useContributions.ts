import { useMemo } from 'react';

import { useQueries } from 'react-query';

import {
  DEWORK,
  WONDER,
} from 'pages/IntegrationCallbackPage/IntegrationCallbackPage';

import {
  Integration,
  useCircleIntegrations,
} from './gql/useCircleIntegrations';

interface TimeInput {
  startDate?: string;
  endDate?: string;
}
export interface Contribution {
  title: string;
  link: string;
  source: string;
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
    { title: 'I did a thing', link: 'http://thing.com', source: 'thing' },
    {
      title: 'And then another',
      link: 'http://another.com',
      source: 'another',
    },
    {
      title: 'And YET ANOTHER! O_O',
      link: 'http://yetanother.com',
      source: 'yetanother',
    },
    { title: 'Gib me tokens', link: 'http://gib.com', source: 'gib' },
    { title: 'I crushed it', link: 'http://crush.com', source: 'crush' },
  ],
};

const ensureSource =
  (source: string) =>
  (res: Response): Response => ({
    ...res,
    users: res.users.map(user => ({
      ...user,
      contributions: user.contributions.map(c => ({
        ...c,
        source,
      })),
    })),
  });

const fetchContributions = async ({
  url,
  label,
}: {
  url: RequestInfo;
  label: string;
}) => {
  let errorMessage;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const jsonResponse = await response.json();
    const modifiedResponse = ensureSource(WONDER)(jsonResponse);
    return modifiedResponse;
  } catch (err: any) {
    errorMessage = err.message;
  }

  if (errorMessage) {
    console.error(`Error fetching ${label} contributions:`, errorMessage, url);
    throw new Error(errorMessage);
  }
};

const deworkIntegration = (
  integration: Integration,
  timeInput: TimeInput
): Promise<Response | undefined> => {
  const url = `https://api.deworkxyz.com/integrations/coordinape/${
    integration.data.organizationId
  }?epoch_start=${timeInput.startDate}&epoch_end=${
    timeInput.endDate
  }&workspace_ids=${encodeURIComponent(
    integration.data.workspaceIds?.join(',') || ''
  )}`;
  return fetchContributions({ url, label: DEWORK });
};

const wonderIntegration = (
  integration: Integration,
  timeInput: TimeInput
): Promise<Response | undefined> => {
  let url = `https://external-api.wonderapp.co/v1/coordinape/contributions?org_id=${integration.data.organizationId}&epoch_start=${timeInput.startDate}&epoch_end=${timeInput.endDate}`;
  if (integration.data.podIds) {
    for (const podId of integration.data.podIds) {
      url += `&pod_ids=${podId}`;
    }
  }
  return fetchContributions({ url, label: WONDER });
};

export function useContributionUsers(
  timeInput: TimeInput,
  circleId: number
): UserContributions {
  const integrations = useCircleIntegrations(circleId);
  const responses = useQueries(
    timeInput.endDate && timeInput.startDate && integrations.data
      ? integrations.data
          .map(integration => ({
            queryKey: `circle-integration-contributions-${integration.id}-${timeInput.startDate}-${timeInput.endDate}`,
            queryFn: () => {
              switch (integration.type) {
                case DEWORK: {
                  return deworkIntegration(integration, timeInput);
                }
                case WONDER: {
                  return wonderIntegration(integration, timeInput);
                }
                default:
                  return;
              }
            },
            staleTime: Infinity,
          }))
          // filter out incompatible/irrelevant integrations
          // TODO: Add an integration class hasura enum to make this more explicit
          // classes could include: contribution, membership, distribution, etc
          .filter(x => x)
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

export function useContributions(input: {
  address: string;
  startDate?: string;
  endDate?: string;
  circleId: number;
  mock?: boolean;
}): Array<Contribution> | undefined {
  const { address, startDate, endDate, circleId, mock } = input;
  const userToContribution = useContributionUsers(
    {
      startDate,
      endDate,
    },
    circleId
  );
  const ret = useMemo(
    () => (address ? userToContribution[address.toLowerCase()] : undefined),
    [address, userToContribution]
  );

  return mock ? mockData[address] : ret;
}
