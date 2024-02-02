import { adminClient } from '../../../../api-lib/gql/adminClient';

import {
  LINKEDIN_SCORE_BASE,
  LINKEDIN_SCORE_MAX,
  LINKEDIN_SCORE_VERIFIED_EMAIL,
} from './scoring';

export const getLinkedInScore = async (profileId: number) => {
  const { linkedin_accounts_by_pk } = await adminClient.query(
    {
      linkedin_accounts_by_pk: [
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
      operationName: 'getLinkedInScore',
    }
  );
  if (!linkedin_accounts_by_pk) {
    return 0;
  }

  const linkedInScore = linkedin_accounts_by_pk.email_verified
    ? LINKEDIN_SCORE_VERIFIED_EMAIL
    : 0;

  return Math.floor(
    Math.min(LINKEDIN_SCORE_MAX, LINKEDIN_SCORE_BASE + linkedInScore)
  );
};
