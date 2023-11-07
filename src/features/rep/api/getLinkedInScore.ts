import { adminClient } from '../../../../api-lib/gql/adminClient';

import {
  GITHUB_SCORE_BASE,
  LINKEDIN_SCORE_MAX,
  LINKEDIN_SCORE_VERIFIED_EMAIL,
} from './scoring';

export const getLinkedInScore = async (profileId: number) => {
  const { linkedin_account_by_pk } = await adminClient.query(
    {
      linkedin_account_by_pk: [
        {
          profile_id: profileId,
        },
        {
          sub: true,
          email_verified: true,
        },
      ],
    },
    {
      operationName: 'getGitHubScore',
    }
  );
  if (!linkedin_account_by_pk) {
    return 0;
  }

  const emailScore = linkedin_account_by_pk.email_verified
    ? LINKEDIN_SCORE_VERIFIED_EMAIL
    : 0;

  return Math.floor(
    Math.min(LINKEDIN_SCORE_MAX, GITHUB_SCORE_BASE + emailScore)
  );
};
