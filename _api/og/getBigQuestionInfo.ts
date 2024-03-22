import { adminClient } from '../../api-lib/gql/adminClient.ts';

export const getBigQuestionInfo = async (id: string) => {
  const { big_questions_by_pk } = await adminClient.query(
    {
      big_questions_by_pk: [
        {
          id: Number(id),
        },
        {
          cover_image_url: true,
          prompt: true,
          css_background_position: true,
        },
      ],
    },
    {
      operationName: 'profileInfoForOgTags',
    }
  );
  return big_questions_by_pk;
};
