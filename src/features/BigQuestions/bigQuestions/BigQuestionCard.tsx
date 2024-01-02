import { DateTime } from 'luxon';

import { coLinksPaths } from '../../../routes/paths';
import { AppLink, Flex, MarkdownPreview, Panel, Text } from '../../../ui';

import { BigQuestion, getState } from './useBigQuestions';

export const BigQuestionCard = ({
  question,
  size,
}: {
  question: BigQuestion;
  size: 'vertical' | 'index' | 'large';
}) => {
  const state = getState(question);
  return (
    <Panel
      as={AppLink}
      to={coLinksPaths.bigQuestion(question.id)}
      css={{
        gap: '$sm',
        p: 0,
        flexDirection: size === 'vertical' ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        overflow: 'clip',
        width: '100%',
        maxWidth: size === 'large' ? undefined : '550px',
      }}
    >
      <Flex
        css={{
          // flexGrow: 1,
          height: size === 'vertical' ? 'auto' : '100%',
          width: size === 'vertical' ? '100%' : 'auto',
          minHeight:
            size === 'vertical'
              ? '180px'
              : size === 'large'
              ? '250px'
              : '120px',
          aspectRatio: size === 'vertical' ? 'initial' : '1/1',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: `${question.css_background_position ?? 'center'}`,
          backgroundSize: 'cover',
          backgroundImage: `url('${question.cover_image_url}')`,
        }}
      />
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
        <Text h2>{question.prompt}</Text>
        {size === 'large' && (
          <MarkdownPreview render source={question.description} />
        )}
        {state === 'open' ? (
          <Flex css={{ gap: '$sm', flexWrap: 'wrap' }}>
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
