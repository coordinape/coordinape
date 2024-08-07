import { bigQuestionSelector } from 'features/BigQuestions/bigQuestions/useBigQuestions';
import { useQuery } from 'react-query';

import useProfileId from '../../hooks/useProfileId';
import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';

export const QUERY_KEY_COLINKS_NAV = 'colinks-nav';
export const useCoLinksNavQuery = () => {
  const profileId = useProfileId();
  return useQuery(
    [QUERY_KEY_COLINKS_NAV, profileId],
    async () => {
      const data = await getCoLinksNavData(profileId as number);
      const profile = data.profiles_by_pk;
      if (!profile) {
        throw new Error('no profile for current user');
      }
      return { ...data, profile, big_question: data.big_questions[0] };
    },
    {
      enabled: !!profileId,
    }
  );
};

const getCoLinksNavData = (profileId: number) =>
  client.query(
    {
      profiles_by_pk: [
        { id: profileId },
        {
          name: true,
          id: true,
          avatar: true,
          address: true,
          description: true,
          tos_agreed_at: true,
          links_held: true,
          invite_code_redeemed_at: true,
          invite_code_requested_at: true,
          cosoul: {
            id: true,
          },
        },
      ],
      big_questions: [
        {
          where: {
            _and: [
              { publish_at: { _lt: 'now()' } },
              { expire_at: { _gt: 'now()' } },
            ],
          },
          order_by: [{ publish_at: order_by.asc_nulls_last }],
          limit: 1,
        },
        bigQuestionSelector,
      ],
    },
    { operationName: 'getCoLinksNavData' }
  );
