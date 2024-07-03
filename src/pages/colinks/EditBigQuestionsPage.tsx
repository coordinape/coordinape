import { BigQuestionCardCover } from 'features/BigQuestions/bigQuestions/BigQuestionCardCover';
import { EditBigQuestionForm } from 'features/BigQuestions/bigQuestions/EditBigQuestionForm';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import { LoadingIndicator } from 'components/LoadingIndicator';
import { Box, Flex, Panel, Text } from 'ui';

export const QUERY_KEY_EDIT_BIG_QUESTION = 'edit_big_questions_query';
export const EditBigQuestionsPage = () => {
  const { data } = useQuery(
    [QUERY_KEY_EDIT_BIG_QUESTION],
    async () => {
      const { getBigQuestions } = await client.query(
        {
          getBigQuestions: {
            id: true,
            description: true,
            prompt: true,
            expire_at: true,
            publish_at: true,
            css_background_position: true,
            cover_image_url: true,
            activities_aggregate: { aggregate: { count: true } },
          },
        },
        {
          operationName: 'EditBigQuestions__getBigQuestions',
        }
      );
      return getBigQuestions;
    },
    {
      enabled: true,
      notifyOnChangeProps: ['data'],
    }
  );

  if (!data) {
    return <LoadingIndicator />;
  }

  return (
    <Flex column css={{ gap: '$1xl ', ml: '$md' }}>
      <Text h1 css={{ m: '$sm' }}>
        Manage Big Questions
      </Text>
      <Panel css={{ maxWidth: '70%', gap: '$1xl' }}>
        <Text semibold css={{ color: '$secondaryText', fontSize: 'large' }}>
          Add new question
        </Text>
        <EditBigQuestionForm></EditBigQuestionForm>
      </Panel>
      <Panel css={{ gap: '$sm', width: '70%' }}>
        <Text semibold css={{ color: '$secondaryText', fontSize: 'large' }}>
          Edit Current Questions
        </Text>
        {data?.map(b => (
          <Box
            key={b.id}
            css={{
              borderRadius: '$3',
              padding: '$md',
              border: '1px solid $border',
            }}
          >
            <BigQuestionCardCover question={b}>
              <EditBigQuestionForm question={b} />
            </BigQuestionCardCover>
          </Box>
        ))}
      </Panel>
    </Flex>
  );
};
