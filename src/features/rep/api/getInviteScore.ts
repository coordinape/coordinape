import { adminClient } from '../../../../api-lib/gql/adminClient';

import {
  INVITE_SCORE_MAX,
  INVITE_SCORE_PER_INVITE_WITH_COSOUL,
  INVITE_SCORE_PER_INVITE_WITH_NO_COSOUL,
} from './scoring';

export const getInviteScore = async (profileId: number) => {
  const { invites_with_cosouls, total_invites } = await adminClient.query(
    {
      __alias: {
        invites_with_cosouls: {
          profiles_aggregate: [
            {
              where: {
                invited_by: {
                  _eq: profileId,
                },
                cosoul: {},
              },
            },
            {
              aggregate: {
                count: [{}, true],
              },
            },
          ],
        },
        total_invites: {
          profiles_aggregate: [
            {
              where: {
                invited_by: {
                  _eq: profileId,
                },
              },
            },
            {
              aggregate: {
                count: [{}, true],
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

  const totalInvites = total_invites?.aggregate?.count ?? 0;
  const coSoulInvites = invites_with_cosouls?.aggregate?.count ?? 0;

  const noCosoulInvites = totalInvites - coSoulInvites;

  const noCoSoulInviteScore =
    noCosoulInvites * INVITE_SCORE_PER_INVITE_WITH_NO_COSOUL;
  const coSoulInviteScore = coSoulInvites * INVITE_SCORE_PER_INVITE_WITH_COSOUL;

  return Math.floor(
    Math.min(INVITE_SCORE_MAX, noCoSoulInviteScore + coSoulInviteScore)
  );
};
