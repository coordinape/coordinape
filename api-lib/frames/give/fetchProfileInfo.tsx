import { adminClient } from '../../gql/adminClient.ts';

export const fetchProfileInfo = async (viewerProfileId: number) => {
  const {
    hasSentGive,
    hasReceivedGive,
    viewerProfile,
    numGiveSent,
    numGiveReceived,
  } = await adminClient.query(
    {
      __alias: {
        hasSentGive: {
          colinks_gives: [
            {
              where: {
                profile_id: {
                  _eq: viewerProfileId,
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
                  _eq: viewerProfileId,
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
            { id: Number(viewerProfileId) },
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
                  _eq: viewerProfileId,
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
                  _eq: viewerProfileId,
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
  };
};
