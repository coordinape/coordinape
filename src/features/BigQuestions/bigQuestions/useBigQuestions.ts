import { DateTime } from 'luxon';
import { useQuery } from 'react-query';

import { order_by, Selector } from '../../../lib/gql/__generated__/zeus';
import { client } from '../../../lib/gql/client';

export const bigQuestionSelector = Selector('big_questions')({
  id: true,
  prompt: true,
  description: true,
  cover_image_url: true,
  publish_at: true,
  expire_at: true,
  css_background_position: true,
  activities_aggregate: [{}, { aggregate: { count: [{}, true] } }],
});

const fetchBigQuestions = async () => {
  const { big_questions } = await client.query(
    {
      big_questions: [
        {
          limit: 10,
          order_by: [{ publish_at: order_by.desc_nulls_last }],
        },
        bigQuestionSelector,
      ],
    },
    {
      operationName: 'bigQuestions',
    },
  );
  return big_questions;
};

export type BigQuestion = Awaited<ReturnType<typeof fetchBigQuestions>>[number];
export const useBigQuestions = () => {
  return useQuery('bigQuestions', fetchBigQuestions);
};

export const getState = (question: { publish_at?: any; expire_at?: any }) => {
  const now = DateTime.now().toUTC().toISO();
  const open = question.publish_at < now && question.expire_at > now;
  const upcoming = question.publish_at > now;

  return open ? 'open' : upcoming ? 'upcoming' : 'closed';
};
