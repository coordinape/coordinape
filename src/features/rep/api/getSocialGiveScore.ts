import { adminClient } from '../../../../api-lib/gql/adminClient';

import {
  SOCIAL_GIVE_MAX,
  SOCIAL_GIVE_RECEIVED_SCORE,
  SOCIAL_GIVE_SENT_SCORE,
} from './scoring';

export const getSocialGiveScore = async (profileId: number) => {
  const { socialGiveSent, socialGiveReceived } = await adminClient.query(
    {
      __alias: {
        socialGiveSent: {
          colinks_gives_aggregate: [
            {
              where: {
                profile_id: { _eq: profileId },
              },
            },
            { aggregate: { count: [{}, true] } },
          ],
        },
        socialGiveReceived: {
          colinks_gives_aggregate: [
            {
              where: {
                target_profile_id: { _eq: profileId },
              },
            },
            { aggregate: { count: [{}, true] } },
          ],
        },
      },
    },
    {
      operationName: 'score__getSocialGiveScores',
    }
  );
  const sentCount = socialGiveSent.aggregate?.count ?? 0;
  const receivedCount = socialGiveReceived.aggregate?.count ?? 0;

  const sentScore = sentCount * SOCIAL_GIVE_SENT_SCORE;
  const receivedScore = receivedCount * SOCIAL_GIVE_RECEIVED_SCORE;

  return Math.floor(Math.min(SOCIAL_GIVE_MAX, sentScore + receivedScore));
};
