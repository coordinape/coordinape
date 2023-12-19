import { useState } from 'react';

import { useNavQuery } from 'features/nav/getNavData';
import { DateTime } from 'luxon';
import { NavLink } from 'react-router-dom';

import { coLinksPaths } from '../../routes/paths';
import { usePathContext } from '../../routes/usePathInfo';
import { useIsCoLinksSite } from '../colinks/useIsCoLinksSite';
import { Edit, Messages, MessageSolid } from 'icons/__generated';
import { ContributionForm } from 'pages/ContributionsPage/ContributionForm';
import { Button, Flex, IconButton, MarkdownPreview, Text } from 'ui';

import { ActivityAvatar } from './ActivityAvatar';
import { ActivityProfileName } from './ActivityProfileName';
import { CircleLogoWithName } from './CircleLogoWithName';
import { ReactionBar } from './reactions/ReactionBar';
import { RepliesBox } from './replies/RepliesBox';
import { Contribution } from './useInfiniteActivities';

export const ContributionRow = ({
  activity,
  drawer,
  focus,
}: {
  activity: Contribution;
  drawer?: boolean;
  focus: boolean;
}) => {
  const { inCircle } = usePathContext();
  const { data } = useNavQuery();
  const editableContribution =
    activity.actor_profile_public.id === data?.profile?.id;
  const [editingContribution, setEditingContribution] = useState(false);
  const [editingReply, setEditingReply] = useState(false);

  const [displayComments, setDisplayComments] = useState(false);

  const isCoLinksPage = useIsCoLinksSite();

  const commentCount = activity.reply_count;

  return (
    <Flex css={{ overflowX: 'clip', position: 'relative' }}>
      <Flex
        className="contributionRow clickThrough"
        alignItems="start"
        onClick={e => {
          if (e.target instanceof HTMLElement) {
            if (
              !editingReply &&
              (e.target.classList.contains('clickThrough') ||
                e.target.classList.contains('code-line') ||
                e.target.classList.length == 0)
            ) {
              setDisplayComments(prev => !prev);
            }
          }
        }}
        css={{
          cursor: 'pointer',
          '.markdownPreview': {
            cursor: 'pointer',
          },
          background: drawer ? '$dim' : '$surface',
          p: drawer ? '$sm $sm $md 0' : '$md',
          borderRadius: '$2',
          flexGrow: 1,
          '&:hover': {
            '.iconMessage': {
              'svg * ': {
                fill: '$ctaHover',
              },
            },
          },
        }}
      >
        {!drawer && <ActivityAvatar profile={activity.actor_profile_public} />}
        <Flex
          className="clickThrough"
          column
          css={{
            flexGrow: 1,
            ml: '$md',
            position: 'relative',
          }}
        >
          <Flex
            className="clickThrough"
            css={{
              gap: '$sm',
              justifyContent: 'space-between',
            }}
          >
            {!drawer && (
              <Flex>
                <ActivityProfileName profile={activity.actor_profile_public} />
                {activity.private_stream ? (
                  <Text
                    as={NavLink}
                    size="small"
                    to={coLinksPaths.post(activity.id)}
                    css={{
                      color: '$neutral',
                      ml: '$md',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    {DateTime.fromISO(activity.created_at).toRelative()}
                  </Text>
                ) : (
                  <Text size="small" css={{ color: '$neutral', ml: '$md' }}>
                    {DateTime.fromISO(activity.created_at).toRelative()}
                  </Text>
                )}
              </Flex>
            )}
            <Flex
              css={{
                gap: '$sm',
                justifyContent: drawer ? 'space-between' : 'initial',
                flexDirection: drawer ? 'row-reverse' : 'row',
                flexGrow: drawer ? 1 : 'initial',
              }}
            >
              {editableContribution && (
                <IconButton
                  onClick={() => setEditingContribution(prev => !prev)}
                >
                  <Edit />
                </IconButton>
              )}
              {!inCircle && activity.circle && (
                <Flex
                  css={{
                    borderLeft:
                      editableContribution && !drawer
                        ? '1px solid $border'
                        : 'none',
                    pl: drawer ? 0 : 'calc($sm + $xs)',
                  }}
                >
                  <CircleLogoWithName
                    circle={activity.circle}
                    reverse={drawer ? false : true}
                  />
                </Flex>
              )}
            </Flex>
          </Flex>
          {editableContribution && (
            <>
              {editingContribution && (
                <>
                  <ContributionForm
                    css={{ textarea: { background: '$surfaceNested ' } }}
                    description={activity.contribution.description}
                    setEditingContribution={setEditingContribution}
                    contributionId={activity.contribution.id}
                    circleId={activity.circle ? activity.circle.id : undefined}
                    itemNounName={isCoLinksPage ? 'Post' : undefined}
                  />
                </>
              )}
            </>
          )}
          {!editingContribution && (
            <>
              <MarkdownPreview
                render
                source={activity.contribution.description}
                css={{ cursor: 'auto', mb: '-$xs', mt: '$xs' }}
              />
              <Flex
                className="clickThrough"
                css={{ justifyContent: 'space-between' }}
              >
                <ReactionBar
                  activityId={activity.id}
                  reactions={activity.reactions}
                  drawer={drawer}
                />
                <Flex className="commentButton">
                  {activity.private_stream && (
                    <>
                      {commentCount > 0 ? (
                        <Button
                          color="link"
                          css={{
                            width: 'auto',
                            textDecoration: 'none',
                            '*': {
                              fill: '$link',
                            },
                          }}
                          onClick={() => setDisplayComments(prev => !prev)}
                        >
                          {commentCount}{' '}
                          <Messages nostroke css={{ ml: '$sm' }} />
                        </Button>
                      ) : (
                        <Button
                          color="transparent"
                          css={{
                            p: '$xs',
                            width: 'auto',
                            '*': {
                              fill: '$secondaryText',
                            },
                          }}
                          onClick={() => setDisplayComments(prev => !prev)}
                        >
                          <Text className="iconMessage">
                            <MessageSolid nostroke css={{ ml: '$sm' }} />
                          </Text>
                        </Button>
                      )}
                    </>
                  )}
                </Flex>
              </Flex>
            </>
          )}
          {(focus || displayComments) && (
            <RepliesBox
              activityId={activity.id}
              activityActorId={activity.actor_profile_public.id}
              setEditingReply={setEditingReply}
            />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
