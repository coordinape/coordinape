import { useState } from 'react';

import { BigQuestionCardCover } from 'features/BigQuestions/bigQuestions/BigQuestionCardCover';
import { artWidthMobile } from 'features/cosoul/constants';
import { Helmet } from 'react-helmet';
import { useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { ActivityList } from '../../../features/activities/ActivityList';
import { ActivityRow } from '../../../features/activities/ActivityRow';
import { activitySelector } from '../../../features/activities/useInfiniteActivities';
import { BigQuestionCard } from '../../../features/BigQuestions/bigQuestions/BigQuestionCard';
import {
  bigQuestionSelector,
  getState,
  useBigQuestions,
} from '../../../features/BigQuestions/bigQuestions/useBigQuestions';
import { PostForm } from '../../../features/colinks/PostForm';
import useProfileId from '../../../hooks/useProfileId';
import { client } from '../../../lib/gql/client';
import { coLinksPaths } from '../../../routes/paths';
import { AppLink, ContentHeader, Flex, Panel, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';
import { NotFound } from '../NotFound';

const fetchBigQuestion = async (id: number, profileId: number) => {
  const { big_questions_by_pk, contributions } = await client.query(
    {
      big_questions_by_pk: [
        {
          id,
        },
        bigQuestionSelector,
      ],
      contributions: [
        {
          where: {
            big_question_id: {
              _eq: id,
            },
            profile_id: {
              _eq: profileId,
            },
          },
        },
        {
          activity: activitySelector,
        },
      ],
    },
    {
      operationName: 'bigQuestions',
    }
  );
  return {
    question: big_questions_by_pk,
    alreadyPosted: contributions[0]?.activity,
  };
};

export const BigQuestionPage = () => {
  const { id } = useParams();
  const questionId = Number(id);
  const [showLoading, setShowLoading] = useState(false);

  const profileId = useProfileId(true);

  const { data: bigQuestions } = useBigQuestions();

  const queryClient = useQueryClient();
  const { data } = useQuery(['bigQuestion', questionId], () =>
    fetchBigQuestion(questionId, profileId)
  );

  const onPostSettled = () => {
    setShowLoading(false);
    queryClient.invalidateQueries(['bigQuestion', questionId]);
  };

  if (!data) {
    // TODO: question not found
    return <LoadingIndicator />;
  }

  if (!data.question) {
    return <NotFound />;
  }

  const { question, alreadyPosted } = data;

  const state = getState(question);

  const isMultipleAnswers = question.id === 7;
  return (
    <SingleColumnLayout>
      <Helmet>
        <title>{question.prompt} / Coordinape</title>
      </Helmet>
      <Flex css={{ gap: '$xl' }}>
        <Flex
          column
          css={{
            flexGrow: 1,
            maxWidth: '$readable',
            width: '100%',
          }}
        >
          <ContentHeader>
            <Flex column css={{ width: '100%', gap: '$md' }}>
              <Flex
                column
                css={{ width: '100%', gap: '$lg', maxWidth: '$readable' }}
              >
                <BigQuestionCardCover question={question} />
                {(!alreadyPosted || isMultipleAnswers) && state === 'open' && (
                  <>
                    <PostForm
                      label={'Post your answer'}
                      bigQuestionId={question.id}
                      showLoading={showLoading}
                      placeholder={
                        (isMultipleAnswers
                          ? 'This one is an OPEN conversation with no limits. Post as many times as you like.'
                          : 'You may answer this question once.') +
                        ' All answers and replies are public to all members of CoLinks.'
                      }
                      // placeholder={'Share your thoughts on The Big Question'}
                      onSave={() => setShowLoading(true)}
                    />
                  </>
                )}
              </Flex>
            </Flex>
          </ContentHeader>
          {(state === 'open' || state === 'closed') && (
            <Flex column css={{ maxWidth: '$readable', gap: '$xl' }}>
              {alreadyPosted && !isMultipleAnswers && (
                <Flex column css={{ gap: '$md' }}>
                  <Text h2>You answered this very nicely</Text>
                  <ActivityRow
                    key={alreadyPosted.id}
                    activity={alreadyPosted}
                  />
                </Flex>
              )}

              <Flex column css={{ gap: '$md' }}>
                <Text h2>
                  {isMultipleAnswers
                    ? `Everyone's answers`
                    : `Everyone else's answers`}
                </Text>
                <ActivityList
                  queryKey={['bigQuestion', id, 'activities']}
                  where={{
                    big_question_id: {
                      _eq: question.id,
                    },
                    actor_profile_id: isMultipleAnswers
                      ? undefined
                      : {
                          _neq: profileId,
                        },
                    contribution: {},
                  }}
                  noPosts={
                    <Panel noBorder>
                      {alreadyPosted
                        ? 'No other answers yet.'
                        : 'No answers yet'}
                    </Panel>
                  }
                  pollForNewActivity={showLoading}
                  onSettled={onPostSettled}
                />
              </Flex>
            </Flex>
          )}
        </Flex>
        <Flex
          column
          css={{
            gap: '$sm',
            width: `${artWidthMobile}`,
            '@tablet': {
              display: 'none',
            },
          }}
        >
          <Flex column css={{ gap: '$md' }}>
            <Flex
              css={{ justifyContent: 'space-between', gap: '$md' }}
              as={AppLink}
              to={coLinksPaths.bigQuestions}
            >
              <Text h2>Other Questions</Text>
              <Text size={'small'}>View All</Text>
            </Flex>
            {bigQuestions
              ?.filter(q => q.id != id)
              .map(q => (
                <BigQuestionCard key={q.id} question={q} size={'vertical'} />
              ))}
          </Flex>
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
};
