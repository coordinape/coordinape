import { Dispatch, SetStateAction } from 'react';

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
          actor_profile_public: {
            id: true,
            name: true,
            avatar: true,
            address: true,
            cosoul: {
              id: true,
            },
          },
          circle: {
            id: true,
            name: true,
            logo: true,
          },
          target_profile: {
            name: true,
            avatar: true,
            address: true,
            cosoul: {
              id: true,
            },
          },
          contribution: {
            description: true,
            created_at: true,
            id: true,
          },
          epoch: {
            start_date: true,
            description: true,
            end_date: true,
            number: true,
            ended: true,
          },
          reactions: [
            {},
            {
              id: true,
              reaction: true,
              profile: {
                name: true,
                id: true,
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

export const useInfiniteActivities = (
  queryKey: QueryKey,
  where: Where,
  setLatestActivityId: Dispatch<SetStateAction<number>>,
  onSettled?: () => void
) => {
  return useInfiniteQuery(
    queryKey,
    ({ pageParam = 0 }) => getActivities(where, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length == 0 ? undefined : allPages.length;
      },
      onSuccess: data => {
        setLatestActivityId(data.pages[0][0]?.id || 0);
      },

      refetchOnWindowFocus: true,
      refetchInterval: 10000,
      onSettled: () => onSettled && onSettled(),
    }
  );
};

export type Activity = Awaited<ReturnType<typeof getActivities>>[number];

type c1 = Activity &
  Required<Pick<Activity, 'contribution' | 'actor_profile_public'>>;

export type c2 = c1 & Pick<Activity, 'circle'>;

export type Contribution = c2 & {
  actor_profile_public: Required<NonNullable<Activity['actor_profile_public']>>;
};

// & Pick<Activity['actor_profile_public'], 'avatar'>}
export function IsContribution(a: Activity): a is Contribution {
  // eslint-disable-next-line no-console
  console.log(a);
  return (
    a.action == 'contributions_insert' &&
    !!a.contribution &&
    !!a.actor_profile_public //&&
    // !!a.circle
  );
}

export type NewUser = Activity &
  Required<Pick<Activity, 'target_profile' | 'circle'>>;

export function IsNewUser(a: Activity): a is NewUser {
  return a.action == 'users_insert' && !!a.target_profile && !!a.circle;
}

export type EpochCreated = Activity &
  Required<Pick<Activity, 'epoch' | 'circle'>>;
export function IsEpochCreated(a: Activity): a is EpochCreated {
  return a.action == 'epochs_insert' && !!a.epoch && !!a.circle;
}

export type EpochEnded = Activity &
  Required<Pick<Activity, 'epoch' | 'circle'>>;
export function IsEpochEnded(a: Activity): a is EpochEnded {
  return a.action == 'epochs_ended' && !!a.epoch && !!a.circle;
}

export type EpochStarted = Activity &
  Required<Pick<Activity, 'epoch' | 'circle'>>;
export function IsEpochStarted(a: Activity): a is EpochStarted {
  return a.action == 'epochs_started' && !!a.epoch && !!a.circle;
}

export type Reaction = Activity['reactions'][number];

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
