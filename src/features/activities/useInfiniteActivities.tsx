import { QueryKey, useInfiniteQuery } from 'react-query';

import { order_by, ValueTypes } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { Awaited } from '../../types/shim';

const PAGE_SIZE = 10;

export type Where = ValueTypes['activities_bool_exp'];

const getActivities = async (where: Where, page: number) => {
  const { activities } = await client.query(
    {
      activities: [
        {
          where,
          order_by: [
            {
              id: order_by.desc,
            },
          ],
          offset: page * PAGE_SIZE,
          limit: PAGE_SIZE,
        },
        {
          id: true,
          action: true,
          created_at: true,
          actor_profile: {
            name: true,
            avatar: true,
          },
          target_profile: {
            name: true,
            avatar: true,
          },
          contribution: {
            description: true,
          },
          epoch: {
            start_date: true,
            description: true,
            end_date: true,
            number: true,
          },
        },
      ],
    },
    {
      operationName: 'getActivity__circleActivity',
    }
  );

  return activities;
};

export const useInfiniteActivities = (queryKey: QueryKey, where: Where) => {
  return useInfiniteQuery(
    queryKey,
    ({ pageParam = 0 }) => getActivities(where, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length == 0 ? undefined : allPages.length + 1;
      },
      refetchOnWindowFocus: false,
    }
  );
};

export type Activity = Awaited<ReturnType<typeof getActivities>>[number];

export type Contribution = Activity &
  Required<Pick<Activity, 'contribution' | 'actor_profile'>>;
export function IsContribution(a: Activity): a is Contribution {
  return (
    a.action == 'contributions_insert' && !!a.contribution && !!a.actor_profile
  );
}

export type NewUser = Activity & Required<Pick<Activity, 'target_profile'>>;
export function IsNewUser(a: Activity): a is NewUser {
  return a.action == 'users_insert' && !!a.target_profile;
}

export type EpochCreated = Activity & Required<Pick<Activity, 'epoch'>>;
export function IsEpochCreated(a: Activity): a is EpochCreated {
  return a.action == 'epoches_insert' && !!a.epoch;
}

export type EpochEnded = Activity & Required<Pick<Activity, 'epoch'>>;
export function IsEpochEnded(a: Activity): a is EpochEnded {
  return a.action == 'epoches_ended' && !!a.epoch;
}

export type EpochStarted = Activity & Required<Pick<Activity, 'epoch'>>;
export function IsEpochStarted(a: Activity): a is EpochStarted {
  return a.action == 'epoches_started' && !!a.epoch;
}
