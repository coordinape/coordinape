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
              created_at: order_by.desc,
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
            address: true,
          },
          circle: {
            id: true,
            name: true,
          },
          target_profile: {
            name: true,
            avatar: true,
            address: true,
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
          reactions: [
            {},
            {
              id: true,
              reaction: true,
              profile: {
                name: true,
                avatar: true,
              },
            },
          ],
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
        return lastPage.length == 0 ? undefined : allPages.length;
      },
      refetchOnWindowFocus: false,
    }
  );
};

export type Activity = Awaited<ReturnType<typeof getActivities>>[number];

export type Contribution = Activity &
  Required<Pick<Activity, 'contribution' | 'actor_profile' | 'circle'>>;
export function IsContribution(a: Activity): a is Contribution {
  return (
    a.action == 'contributions_insert' &&
    !!a.contribution &&
    !!a.actor_profile &&
    !!a.circle
  );
}

export type NewUser = Activity &
  Required<Pick<Activity, 'target_profile' | 'circle'>>;

export function IsNewUser(a: Activity): a is NewUser {
  return a.action == 'users_insert' && !!a.target_profile && !!a.circle;
}

export type EpochCreated = Activity & Required<Pick<Activity, 'epoch'>>;
export function IsEpochCreated(a: Activity): a is EpochCreated {
  return a.action == 'epochs_insert' && !!a.epoch;
}

export type EpochEnded = Activity & Required<Pick<Activity, 'epoch'>>;
export function IsEpochEnded(a: Activity): a is EpochEnded {
  return a.action == 'epochs_ended' && !!a.epoch;
}

export type EpochStarted = Activity & Required<Pick<Activity, 'epoch'>>;
export function IsEpochStarted(a: Activity): a is EpochStarted {
  return a.action == 'epochs_started' && !!a.epoch;
}

export type Reactions = Activity & Required<Pick<Activity, 'reactions'>>;

export function IsDeleted(a: Activity) {
  // epoch are hard deleted, so we never see them here.
  // user's removed from circle is not supported by this right now.
  switch (a.action) {
    case 'contributions_insert':
      return !a.contribution;
    default:
      return false;
  }
}
