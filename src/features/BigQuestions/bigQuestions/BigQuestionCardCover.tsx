import { DateTime } from 'luxon';

import { coLinksPaths } from '../../../routes/paths';
import { AppLink, Flex, MarkdownPreview, Panel, Text } from '../../../ui';

import { BigQuestion, getState } from './useBigQuestions';

export const BigQuestionCardCover = ({
  question,
}: {
  question: BigQuestion;
}) => {
  const state = getState(question);
  return (
    <Panel
      as={AppLink}
      to={coLinksPaths.bigQuestion(question.id)}
      css={{
        p: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        border: 'none',
        overflow: 'clip',
        width: '100%',
        position: 'relative',
      }}
    >
      <Flex
        css={{
          flexGrow: 1,
          height: '100%',
          width: '100%',
          minHeight: '240px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: `${question.css_background_position ?? 'center'}`,
          backgroundSize: 'cover',
          backgroundImage: `url('${question.cover_image_url}')`,
          p: '$3xl $lg $4xl',
        }}
      >
        <Flex column css={{ alignItems: 'flex-start' }}>
          <Text
            css={{
              fontSize: '$h1',
              color: 'white',
              // textShadow: '0px 1px 4px #0000004f',
              fontStyle: 'italic',
              background: 'rgba(0,0,0,0.8)',
              px: '$sm',
              display: 'inline',
              width: 'auto',
            }}
          >
            Town Square // Question
          </Text>
          <Text
            semibold
            css={{
              fontSize: '40px',
              color: 'white',
              width: '100%',
              textShadow: 'rgb(0 0 0 / 70%) 1px 1px 34px',
            }}
          >
            {question.prompt}
          </Text>
        </Flex>
      </Flex>

      <Flex
        column
        css={{
          flexGrow: 1,
          gap: '$sm',
          // alignItems: 'center',
          p: '$md',
          color: '$text',
        }}
      >
        <MarkdownPreview render source={question.description} />
        {state === 'open' ? (
          <Flex css={{ gap: '$sm' }}>
            <Text tag color={'complete'}>
              Open
            </Text>
            <Text tag color={'dim'}>
              Closes{' '}
              {DateTime.fromISO(question.expire_at, {
                zone: 'utc',
              }).toRelative()}
            </Text>
          </Flex>
        ) : state === 'closed' ? (
          <Flex>
            <Text tag color={'warning'}>
              Closed
            </Text>
          </Flex>
        ) : state === 'upcoming' ? (
          <Flex css={{ gap: '$sm' }}>
            <Text tag color={'secondary'}>
              Upcoming -{' '}
              {DateTime.fromISO(question.publish_at, {
                zone: 'utc',
              }).toRelative()}
            </Text>
          </Flex>
        ) : null}
        {/*<Text size="small" css={{ color: '$neutral' }}>*/}
        {/*  {DateTime.fromISO(question.publish_at, {*/}
        {/*    zone: 'utc',*/}
        {/*  }).toRelative()}*/}
        {/*</Text>*/}
      </Flex>
    </Panel>
  );
};
