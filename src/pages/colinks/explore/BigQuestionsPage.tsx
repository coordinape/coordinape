import { Helmet } from 'react-helmet';

import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { BigQuestionCard } from '../../../features/BigQuestions/bigQuestions/BigQuestionCard';
import { useBigQuestions } from '../../../features/BigQuestions/bigQuestions/useBigQuestions';
import { ContentHeader, Flex, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';

export const BigQuestionsPage = () => {
  const { data } = useBigQuestions();
  return (
    <SingleColumnLayout>
      <Helmet>
        <title>Town Square / CoLinks</title>
      </Helmet>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            Town Square
          </Text>
          <Text>What shall we discuss?</Text>
        </Flex>
      </ContentHeader>
      <Flex column css={{ maxWidth: '$readable', gap: '$md' }}>
        {!data ? (
          <LoadingIndicator />
        ) : (
          data.map(q => (
            <BigQuestionCard key={q.id} question={q} size={'index'} />
          ))
        )}
      </Flex>
    </SingleColumnLayout>
  );
};
