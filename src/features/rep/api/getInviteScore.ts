import { adminClient } from '../../../../api-lib/gql/adminClient';

import {
  COLINKS_INREACT_APP_SCORE_MAX,
  COLINKS_INREACT_APP_SCORE_PER_INREACT_APP_BASE,
  COLINKS_INREACT_APP_SCORE_PER_INVITEE_REPUTATION_BONUS_MAX,
} from './scoring';

export const getInviteScore = async (profileId: number) => {
  const { invitees } = await adminClient.query(
    {
      __alias: {
        invitees: {
          profiles: [
            {
              where: {
                invited_by: {
                  _eq: profileId,
                },
                links_held: {
                  _gt: 0,
                },
              },
            },
            {
              reputation_score: {
                total_score: true,
              },
            },
          ],
        },
      },
    },
    {
      operationName: 'getKeysScore',
    }
  );

  const totalInvites = invitees.length;

  // get a bonus for each invite, their rep score /2000 * INREACT_APP_SCORE_PER_INREACT_APP_SCORE_BONUS
  const inviteScoreBonus = invitees.reduce((acc, invitee) => {
    return (
      acc +
      ((invitee.reputation_score?.total_score ?? 0) / 2000) *
        COLINKS_INREACT_APP_SCORE_PER_INVITEE_REPUTATION_BONUS_MAX
    );
  }, 0);

  const score =
    totalInvites * COLINKS_INREACT_APP_SCORE_PER_INREACT_APP_BASE +
    inviteScoreBonus;
  return Math.floor(Math.min(COLINKS_INREACT_APP_SCORE_MAX, score));
};
