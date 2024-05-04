import { order_by } from '../../gql/__generated__/zeus';
import { adminClient } from '../../gql/adminClient.ts';

export const fetchProfileInfo = async (profileId: number) => {
  const {
    hasSentGive,
    hasReceivedGive,
    viewerProfile,
    numGiveSent,
    numGiveReceived,
    topSkills,
  } = await adminClient.query(
    {
      __alias: {
        topSkills: {
          colinks_gives_skill_count: [
            {
              limit: 4,
              order_by: [{ gives: order_by.desc_nulls_last }],
              where: {
                target_profile_id: {
                  _eq: profileId,
                },
              },
            },
            {
              skill: true,
              gives: true,
            },
          ],
        },
        hasSentGive: {
          colinks_gives: [
            {
              where: {
                profile_id: {
                  _eq: profileId,
                },
              },
              limit: 1,
            },
            {
              id: true,
            },
          ],
        },
        hasReceivedGive: {
          colinks_gives: [
            {
              where: {
                target_profile_id: {
                  _eq: profileId,
                },
              },
              limit: 1,
            },
            {
              id: true,
            },
          ],
        },
        viewerProfile: {
          profiles_by_pk: [
            { id: Number(profileId) },
            {
              cosoul: {
                id: true,
              },
              links_held: true,
              links: true,
            },
          ],
        },
        numGiveSent: {
          colinks_gives_aggregate: [
            {
              where: {
                profile_id: {
                  _eq: profileId,
                },
              },
            },
            { aggregate: { count: [{}, true] } },
          ],
        },
        numGiveReceived: {
          colinks_gives_aggregate: [
            {
              where: {
                target_profile_id: {
                  _eq: profileId,
                },
              },
            },
            { aggregate: { count: [{}, true] } },
          ],
        },
      },
    },
    {
      operationName: 'frames_fetchProfileInfo @cached(ttl: 30)',
    }
  );

  // eslint-disable-next-line no-console
  console.log({
    hasSentGive,
    hasReceivedGive,
    viewerProfile,
    numGiveSent,
    numGiveReceived,
  });

  return {
    hasSentGive: !!hasSentGive[0]?.id,
    hasReceivedGive: !!hasReceivedGive[0]?.id,
    hasCoSoul: !!viewerProfile?.cosoul?.id,
    linksHeld: viewerProfile?.links_held || 0,
    numGiveSent: numGiveSent?.aggregate?.count || 0,
    numGiveReceived: numGiveReceived?.aggregate?.count || 0,
    topSkills,
  };
};

export const fetchCoLinksProfile = async (address: string) => {
  const { profiles_public } = await adminClient.query(
    {
      profiles_public: [
        {
          where: {
            address: {
              _ilike: address,
            },
          },
        },
        {
          id: true,
          name: true,
          avatar: true,
          address: true,
          website: true,
          links: true,
          description: true,
          reputation_score: {
            total_score: true,
          },
        },
      ],
    },
    {
      operationName: 'coLinks_profile',
    }
  );
  const profile = profiles_public.pop();

  return profile ? profile : null;
};

export type PublicProfile = NonNullable<
  Required<Awaited<ReturnType<typeof fetchCoLinksProfile>>>
>;
