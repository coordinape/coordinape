import assert from 'assert';

import { useQuery } from 'react-query';

import { ShareTokenType } from '../../common-lib/shareTokens';
import { client } from '../../lib/gql/client';

export const useInviteToken = (circleId: number) => {
  return useCircleTokens(circleId, ShareTokenType.Invite);
};

export const useWelcomeToken = (circleId: number) => {
  return useCircleTokens(circleId, ShareTokenType.Welcome);
};

export const deleteInviteToken = (circleId: number) => {
  return deleteToken(circleId, ShareTokenType.Invite);
};

export const deleteWelcomeToken = (circleId: number) => {
  return deleteToken(circleId, ShareTokenType.Welcome);
};

const useCircleTokens = (circleId: number, type: ShareTokenType) => {
  return useQuery(
    ['circle-token-', circleId, type],
    async (): Promise<string> => {
      const { circle_share_tokens } = await client.query(
        {
          circle_share_tokens: [
            {
              where: {
                circle: { deleted_at: { _is_null: true } },
                circle_id: { _eq: circleId },
                type: { _eq: type },
              },
            },
            { uuid: true },
          ],
        },
        { operationName: 'getCircleTokens' }
      );
      const token = circle_share_tokens?.pop();
      if (token) return token.uuid;

      // none exists, need to make one
      const { insert_circle_share_tokens_one } = await client.mutate(
        {
          insert_circle_share_tokens_one: [
            { object: { circle_id: circleId, type: type } },
            { uuid: true },
          ],
        },
        { operationName: 'createCircleShareTokens' }
      );
      assert(insert_circle_share_tokens_one);
      return insert_circle_share_tokens_one.uuid;
    }
  );
};

const deleteToken = async (circleId: number, type: ShareTokenType) => {
  await client.mutate(
    {
      delete_circle_share_tokens_by_pk: [
        { circle_id: circleId, type: type },
        { __typename: true },
      ],
    },
    { operationName: 'deleteCircleShareTokens' }
  );
};
