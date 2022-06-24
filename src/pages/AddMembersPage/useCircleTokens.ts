import assert from 'assert';

import { useQuery } from 'react-query';

import { CircleTokenType } from '../../common-lib/circleShareTokens';
import { client } from '../../lib/gql/client';

export const useMagicToken = (circleId: number) => {
  return useCircleTokens(circleId, CircleTokenType.Magic);
};

export const useWelcomeToken = (circleId: number) => {
  return useCircleTokens(circleId, CircleTokenType.Welcome);
};

export const deleteMagicToken = (circleId: number) => {
  return deleteToken(circleId, CircleTokenType.Magic);
};

export const deleteWelcomeToken = (circleId: number) => {
  return deleteToken(circleId, CircleTokenType.Welcome);
};

const useCircleTokens = (circleId: number, type: CircleTokenType) => {
  return useQuery(
    ['circle-token-', circleId, type],
    async (): Promise<string> => {
      const { circle_share_tokens } = await client.query({
        circle_share_tokens: [
          {
            where: {
              circle_id: {
                _eq: circleId,
              },
              type: {
                _eq: type,
              },
            },
          },
          {
            uuid: true,
          },
        ],
      });
      const token = circle_share_tokens?.pop();
      if (token) {
        return token.uuid;
      }

      // none exists, need to make one
      const { insert_circle_share_tokens_one } = await client.mutate({
        insert_circle_share_tokens_one: [
          {
            object: {
              circle_id: circleId,
              type: type,
            },
          },
          {
            uuid: true,
          },
        ],
      });
      assert(insert_circle_share_tokens_one);
      return insert_circle_share_tokens_one.uuid;
    }
  );
};

const deleteToken = async (circleId: number, type: CircleTokenType) => {
  await client.mutate({
    delete_circle_share_tokens_by_pk: [
      {
        circle_id: circleId,
        type: type,
      },
      {
        __typename: true,
      },
    ],
  });
};
