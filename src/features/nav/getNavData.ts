import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import useProfileId from 'hooks/useProfileId';

export const getNavData = (profileId: number) =>
  client.query(
    {
      organizations: [
        {
          order_by: [{ name: order_by.asc }],
        },
        {
          id: true,
          name: true,
          logo: true,
          members: [
            { where: { profile_id: { _eq: profileId } } },
            { role: true, hidden: true },
          ],
          __alias: {
            otherCircles: {
              circles: [
                {
                  where: {
                    _not: { users: { profile: { id: { _eq: profileId } } } },
                  },
                  order_by: [{ name: order_by.asc }],
                },
                {
                  id: true,
                  name: true,
                  logo: true,
                },
              ],
            },
            myCircles: {
              circles: [
                {
                  where: {
                    users: { profile: { id: { _eq: profileId } } },
                  },
                  order_by: [{ name: order_by.asc }],
                },
                {
                  id: true,
                  name: true,
                  logo: true,
                  users: [
                    { where: { profile: { id: { _eq: profileId } } } },
                    { role: true, id: true },
                  ],
                },
              ],
            },
          },
        },
      ],
      profiles: [
        { limit: 1, where: { id: { _eq: profileId } } },
        {
          name: true,
          id: true,
          avatar: true,
          address: true,
          description: true,
          links_held: true,
          tos_agreed_at: true,
          cosoul: {
            id: true,
          },
        },
      ],
      users: [{ where: { profile: { id: { _eq: profileId } } } }, { id: true }],
    },
    { operationName: 'getNavData' }
  );

export const QUERY_KEY_NAV = 'Nav';

// FIXME this is redundant with fetchManifest
export const useNavQuery = () => {
  const profileId = useProfileId();

  return useQuery(
    [QUERY_KEY_NAV, profileId],
    async () => {
      const data = await getNavData(profileId as number);
      const profile = data.profiles?.[0];
      if (!profile) {
        throw new Error('no profile for current user');
      }
      return { ...data, profile };
    },
    {
      enabled: !!profileId,
      staleTime: Infinity,
    }
  );
};

export type NavQuery = Partial<ReturnType<typeof useNavQuery>>;
export type NavQueryData = ReturnType<typeof useNavQuery>['data'];
export type NavOrg = NonNullable<NavQuery['data']>['organizations'][number];
export type NavCircle =
  | NavOrg['myCircles'][number]
  | NavOrg['otherCircles'][number];
