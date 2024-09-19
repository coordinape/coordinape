import { Dispatch, SetStateAction } from 'react';

import { QueryKey, useInfiniteQuery } from 'react-query';

import useProfileId from '../../hooks/useProfileId';
import {
  order_by as anon_order_by,
  Selector as AnonSelector,
  ValueTypes as AnonValueTypes,
} from '../../lib/anongql/__generated__/zeus';
import { anonClient } from '../../lib/anongql/anonClient';
import {
  order_by,
  Selector,
  ValueTypes,
} from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { Awaited } from '../../types/shim';

import { fetchCasts } from './cast';

const PAGE_SIZE = 10;

export type Where = ValueTypes['activities_bool_exp'];
export type AnonWhere = AnonValueTypes['activities_bool_exp'];

export const activitySelector = Selector('activities')({
  id: true,
  action: true,
  created_at: true,
  private_stream: true,
  cast_id: true,
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
      profile_public: {
        name: true,
        id: true,
      },
    },
  ],
  enriched_cast: {
    hash: true,
  },
});

export const anon_activitySelector = AnonSelector('activities')({
  id: true,
  action: true,
  created_at: true,
  private_stream: true,
  cast_id: true,
  gives: [
    {
      order_by: [
        {
          created_at: anon_order_by.desc,
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
  target_profile_public: {
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
  reply_count: true,
  reactions: [
    {},
    {
      id: true,
      reaction: true,
      profile_public: {
        name: true,
        id: true,
      },
    },
  ],
  enriched_cast: {
    hash: true,
  },
});

const getActivities = async (
  anon: boolean,
  where: Where | AnonWhere,
  page: number
) => {
  const activities = anon
    ? await getAnonActivities(where as AnonWhere, page)
    : await getAuthedActivities(where as Where, page);
  // enrich these activities if they have casts
  const cast_ids = activities.filter(a => a.cast_id).map(a => a.cast_id);
  const casts = await fetchCasts(cast_ids);
  type enrichedActivity = (typeof activities)[number] & {
    cast?: (typeof casts)[number];
  };

  const enriched: enrichedActivity[] = activities.map(a => {
    if (a.cast_id) {
      return { ...a, cast: casts.find(c => c.id == a.cast_id) };
    }
    return a;
  });
  return enriched;
};

const getAnonActivities = async (where: AnonWhere, page: number) => {
  const { activities } = await anonClient.query(
    {
      activities: [
        {
          where,
          order_by: [
            {
              created_at: anon_order_by.desc,
            },
          ],
          offset: page * PAGE_SIZE,
          limit: PAGE_SIZE,
        },
        anon_activitySelector,
      ],
    },
    {
      operationName: 'getInfiniteActivities',
    }
  );
  return activities;
};

const getAuthedActivities = async (where: Where, page: number) => {
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
  const profileID = useProfileId(false);
  return useInfiniteQuery(
    queryKey,
    ({ pageParam = 0 }) => getActivities(!profileID, where, pageParam),
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
export type AuthedActivity = Awaited<
  ReturnType<typeof getAuthedActivities>
>[number];

type RequireFields<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type ActivityWithValidProfile = Activity & {
  actor_profile_public: RequireFields<
    NonNullable<Activity['actor_profile_public']>,
    'address' | 'name'
  >;
};

export type Contribution = AuthedActivity &
  Required<Pick<AuthedActivity, 'contribution' | 'actor_profile_public'>> &
  Pick<AuthedActivity, 'circle'> & {
    actor_profile_public: Required<
      NonNullable<Activity['actor_profile_public']>
    >;
  };

export type CastActivity = Activity &
  Required<Pick<Activity, 'cast' | 'actor_profile_public'>> & {
    actor_profile_public: Required<
      NonNullable<Activity['actor_profile_public']>
    >;
  };

export function IsContribution(a: AuthedActivity): a is Contribution {
  return (
    a.action == 'contributions_insert' &&
    !!a.contribution &&
    !!a.actor_profile_public
  );
}

export function IsCast(a: Activity): a is CastActivity {
  return (
    a.action == 'enriched_casts_insert' && !!a.cast && !!a.actor_profile_public
  );
}

export type NewUser = AuthedActivity &
  Required<Pick<AuthedActivity, 'target_profile' | 'circle'>>;

export function IsNewUser(a: AuthedActivity): a is NewUser {
  return a.action == 'users_insert' && !!a.target_profile && !!a.circle;
}

export type EpochCreated = AuthedActivity &
  Required<Pick<AuthedActivity, 'epoch' | 'circle'>>;
export function IsEpochCreated(a: AuthedActivity): a is EpochCreated {
  return a.action == 'epochs_insert' && !!a.epoch && !!a.circle;
}

export type EpochEnded = AuthedActivity &
  Required<Pick<AuthedActivity, 'epoch' | 'circle'>>;
export function IsEpochEnded(a: AuthedActivity): a is EpochEnded {
  return a.action == 'epochs_ended' && !!a.epoch && !!a.circle;
}

export type EpochStarted = AuthedActivity &
  Required<Pick<AuthedActivity, 'epoch' | 'circle'>>;
export function IsEpochStarted(a: AuthedActivity): a is EpochStarted {
  return a.action == 'epochs_started' && !!a.epoch && !!a.circle;
}

export type Reaction = Activity['reactions'][number];

export function IsDeleted(a: AuthedActivity) {
  // epoch are hard deleted, so we never see them here.
  // user's removed from circle is not supported by this right now.
  switch (a.action) {
    case 'contributions_insert':
      return !a.contribution;
    default:
      return false;
  }
}
