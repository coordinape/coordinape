import { adminClient } from '../../../../api-lib/gql/adminClient';

import { GITHUB_SCORE_BASE, GITHUB_SCORE_MAX } from './scoring';

export const getGitHubScore = async (profileId: number) => {
  const { github_accounts_by_pk } = await adminClient.query(
    {
      github_accounts_by_pk: [
        {
          profile_id: profileId,
        },
        {
          github_id: true,
        },
      ],
    },
    {
      operationName: 'getGitHubScore',
    }
  );
  if (!github_accounts_by_pk) {
    return 0;
  }

  return Math.floor(Math.min(GITHUB_SCORE_MAX, GITHUB_SCORE_BASE));
};
