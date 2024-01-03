import { CSS } from '@stitches/react';
import { DateTime } from 'luxon';

import { coLinksPaths } from '../../../routes/paths';
import { AppLink, Flex, MarkdownPreview, Panel, Text } from '../../../ui';

import { BigQuestion, getState } from './useBigQuestions';

export const BigQuestionCard = ({
  question,
  size,
  css,
  innerLabel,
}: {
  question: BigQuestion | Omit<BigQuestion, 'activities_aggregate'>;
  size: 'vertical' | 'index' | 'large' | 'post';
  css?: CSS;
  innerLabel?: boolean;
}) => {
  const state = getState(question);
  return (
    <Panel
      as={AppLink}
      to={coLinksPaths.bigQuestion(question.id)}
      css={{
        p: size === 'post' ? '$sm' : 0,
        flexDirection: size === 'vertical' ? 'column' : 'row',
        alignItems:
          size === 'large' || size === 'post' ? 'center' : 'flex-start',
        justifyContent: 'center',
        border: 'none',
        overflow: 'clip',
        width: '100%',
        maxWidth: size === 'large' ? undefined : '550px',
        ...(size === 'post' && {
          maxWidth: 'none',
          background: '$surfaceDim',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }),
        ...css,
      }}
    >
      <Flex
        css={{
          // flexGrow: 1,
          height:
            size === 'vertical' ? 'auto' : size === 'post' ? '64px' : '100%',
          width:
            size === 'vertical' ? '100%' : size === 'post' ? '64px' : 'auto',
          minHeight:
            size === 'vertical'
              ? '180px'
              : size === 'large'
              ? '250px'
              : size === 'post'
              ? '64px'
              : '120px',
          aspectRatio: size === 'vertical' ? 'initial' : '1/1',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: `${question.css_background_position ?? 'center'}`,
          backgroundSize: 'cover',
          backgroundImage: `url('${question.cover_image_url}')`,
          borderRadius: '$1',
          alignItems: 'flex-end',
        }}
      >
        {innerLabel && (
          <Text
            css={{
              fontSize: '$h2',
              color: '#ffffffee',
              fontStyle: 'italic',
              background: 'rgba(0,0,0,0.8)',
              px: '$sm',
              m: '$md',
              display: 'inline',
              width: 'auto',
            }}
          >
            The Big Question
          </Text>
        )}
      </Flex>
      <Flex
        column
        css={{
          flexGrow: 1,
          gap: size === 'post' ? 0 : '$sm',
          // alignItems: 'center',
          p: '$sm $md',
          color: '$text',
          width: '100%',
        }}
      >
        {size === 'post' && <Text variant="label">The Big Question</Text>}
        <Text semibold css={{ fontSize: size === 'post' ? '$medium' : '$h2' }}>
          {question.prompt}
        </Text>
        {size === 'large' && (
          <MarkdownPreview render source={question.description} />
        )}
        {size != 'post' && (
          <Flex
            css={{ width: '100%', gap: '$md', justifyContent: 'space-between' }}
          >
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
                  Upcoming
                  {/*  -{' '}*/}
                  {/*{DateTime.fromISO(question.publish_at, {*/}
                  {/*  zone: 'utc',*/}
                  {/*}).toRelative()}*/}
                </Text>
              </Flex>
            ) : null}
            {state !== 'upcoming' && (
              <Text size="small" semibold>
                {('activities_aggregate' in question &&
                  question.activities_aggregate?.aggregate?.count) ??
                  0}{' '}
                Posts
              </Text>
            )}
          </Flex>
        )}
      </Flex>
    </Panel>
  );
};
