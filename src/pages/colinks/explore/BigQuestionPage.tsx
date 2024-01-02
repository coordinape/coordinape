import { useState } from 'react';

import { Helmet } from 'react-helmet';
import { useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { ActivityList } from '../../../features/activities/ActivityList';
import { ActivityRow } from '../../../features/activities/ActivityRow';
import { activitySelector } from '../../../features/activities/useInfiniteActivities';
import { BigQuestionCard } from '../../../features/BigQuestions/bigQuestions/BigQuestionCard';
import {
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
        {
          id: true,
          prompt: true,
          description: true,
          cover_image_url: true,
          created_at: true,
          publish_at: true,
          expire_at: true,
        },
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
          limit: 1,
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

  return (
    <SingleColumnLayout>
      <Helmet>
        <title>{question.prompt} / CoLinks</title>
      </Helmet>
      <Flex css={{ gap: '$xl' }}>
        <Flex column css={{ gap: '$xl', flexGrow: 1, maxWidth: '$readable' }}>
          <ContentHeader>
            <Flex column css={{ width: '100%' }}>
              <Text h2 display>
                The Big Question
              </Text>
              <Text>
                Everyone answers the same question, once. All posts and replies
                are public to all members of CoLinks.
              </Text>
              <Flex
                column
                css={{ width: '100%', gap: '$lg', maxWidth: '$readable' }}
              >
                <BigQuestionCard question={question} size={'large'} />
                {!alreadyPosted && state === 'open' && (
                  <PostForm
                    label={'Post your answer'}
                    bigQuestionId={question.id}
                    showLoading={showLoading}
                    placeholder={'Share your thoughts on The Big Question'}
                    onSave={() => setShowLoading(true)}
                  />
                )}
              </Flex>
            </Flex>
          </ContentHeader>
          {(state === 'open' || state === 'closed') && (
            <Flex column css={{ maxWidth: '$readable', gap: '$xl' }}>
              {alreadyPosted && (
                <Flex column css={{ gap: '$md' }}>
                  <Text h2>You answered this very nicely</Text>
                  <ActivityRow
                    key={alreadyPosted.id}
                    activity={alreadyPosted}
                  />
                </Flex>
              )}

              <Flex column css={{ gap: '$md' }}>
                <Text h2>Everyone else&apos;s answers</Text>
                <ActivityList
                  queryKey={['bigQuestion', id, 'activities']}
                  where={{
                    big_question_id: {
                      _eq: question.id,
                    },
                    actor_profile_id: {
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
            width: `230px`,
            '@tablet': {
              display: 'none',
            },
          }}
        >
          <Flex column css={{}}>
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
                <BigQuestionCard key={q.id} question={q} size={'small'} />
              ))}
          </Flex>
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
};
