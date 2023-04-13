import assert from 'assert';

import { useQuery } from 'react-query';

import { ShareTokenType } from '../../common-lib/shareTokens';
import { client } from '../../lib/gql/client';

export const useOrgShareToken = (orgId: number, type: ShareTokenType) => {
  return useQuery(
    ['org-share-token-', type, orgId],
    async (): Promise<string> => {
      const { org_share_tokens } = await client.query(
        {
          org_share_tokens: [
            { where: { org_id: { _eq: orgId }, type: { _eq: type } } },
            { uuid: true },
          ],
        },
        { operationName: 'getOrgTokens' }
      );
      const token = org_share_tokens?.pop();
      if (token) return token.uuid;

      // none exists, need to make one
      const { insert_org_share_tokens_one: newToken } = await client.mutate(
        {
          insert_org_share_tokens_one: [
            { object: { org_id: orgId, type } },
            { uuid: true },
          ],
        },
        { operationName: 'createOrgTokens' }
      );
      assert(newToken);
      return newToken.uuid;
    },
    { enabled: !!orgId }
  );
};

// TODO revoking tokens
