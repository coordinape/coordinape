import { Dispatch, SetStateAction } from 'react';

import { QueryKey, useInfiniteQuery } from 'react-query';

import {
  order_by,
  Selector,
  ValueTypes,
} from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { Awaited } from '../../types/shim';

const PAGE_SIZE = 10;

export type Where = ValueTypes['activities_bool_exp'];

export const activitySelector = Selector('activities')({
  id: true,
  action: true,
  created_at: true,
  private_stream: true,
  gives: [
    {
      order_by: [
        {
          created_at: order_by.desc,
        },
      ],
    },
    {
      id: true,
      skill: true,
      attestation_uid: true,
      giver_profile_public: {
        name: true,
        id: true,
        address: true,
        avatar: true,
      },
    },
  ],
  gives_aggregate: [{}, { aggregate: { count: [{}, true] } }],
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
  big_question: {
    cover_image_url: true,
    description: true,
    prompt: true,
    id: true,
    expire_at: true,
    publish_at: true,
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
  reply_count: true,
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
});
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
        activitySelector,
      ],
    },
    {
      operationName: 'getInfiniteActivities',
    }
  );

  return activities;
};

export const useInfiniteActivities = (
  queryKey: QueryKey,
  where: Where,
  setLatestActivityId: Dispatch<SetStateAction<number>>,
  onSettled?: () => void,
  overrideRefetchInterval?: number
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
      refetchInterval: overrideRefetchInterval ?? 10000,
      onSettled: () => onSettled && onSettled(),
      notifyOnChangeProps: 'tracked',
    }
  );
};

export type Activity = Awaited<ReturnType<typeof getActivities>>[number];

export type Contribution = Activity &
  Required<Pick<Activity, 'contribution' | 'actor_profile_public'>> &
  Pick<Activity, 'circle'> & {
    actor_profile_public: Required<
      NonNullable<Activity['actor_profile_public']>
    >;
  };

export function IsContribution(a: Activity): a is Contribution {
  return (
    a.action == 'contributions_insert' &&
    !!a.contribution &&
    !!a.actor_profile_public
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
