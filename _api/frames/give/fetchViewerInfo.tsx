import { adminClient } from '../../../api-lib/gql/adminClient.ts';

export const fetchViewerInfo = async (viewerProfileId: number) => {
  const { hasSentGive, hasReceivedGive, viewerProfile, numGiveSent } =
    await adminClient.query(
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
        },
      },
      {
        operationName: 'giveHomeFrame_getPersonaLevel',
      }
    );

  // eslint-disable-next-line no-console
  console.log({ hasSentGive, hasReceivedGive, viewerProfile, numGiveSent });

  return {
    hasSentGive: !!hasSentGive[0]?.id,
    hasReceivedGive: !!hasReceivedGive[0]?.id,
    hasCoSoul: !!viewerProfile?.cosoul?.id,
    linksHeld: viewerProfile?.links_held || 0,
    numGiveSent: numGiveSent?.aggregate?.count || 0,
  };
};
