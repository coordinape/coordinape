import { useState } from 'react';

import { ACTIVITIES_QUERY_KEY } from 'features/activities/ActivityList';
import { BigQuestionCard } from 'features/BigQuestions/bigQuestions/BigQuestionCard';
import { QUERY_KEY_COLINKS } from 'features/colinks/wizard/CoLinksWizard';
import { useNavQuery } from 'features/nav/getNavData';
import { CoLinksGiveButton } from 'features/points/CoLinksGiveButton';
import { PostGives } from 'features/points/PostGives';
import { useDeleteGiveMutation } from 'features/points/useDeleteGiveMutation';
import { POINTS_QUERY_KEY } from 'features/points/usePoints';
import { DateTime } from 'luxon';
import { useQueryClient } from 'react-query';
import { NavLink, useLocation } from 'react-router-dom';

import useProfileId from '../../hooks/useProfileId';
import { coLinksPaths } from '../../routes/paths';
import { isFeatureEnabled } from 'config/features';
import { Edit, Message, Messages, ShareSolid } from 'icons/__generated';
import { Button, Flex, IconButton, Link, Text } from 'ui';

import { ActivityAvatar } from './ActivityAvatar';
import { ActivityProfileName } from './ActivityProfileName';
import { PostStats } from './PostStats';
import { ReactionBar } from './reactions/ReactionBar';
import { RepliesBox } from './replies/RepliesBox';
import { SharePostModal } from './SharePostModal';
import { ActivityWithValidProfile } from './useInfiniteActivities';

export type PostRowChildProps = {
  editing: boolean;
  editable: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PostRow = ({
  activity,
  focus,
  editAllowed,
  children,
  castByline,
  postType,
  timestampVerb,
  link,
}: {
  activity: ActivityWithValidProfile;
  focus: boolean;
  editAllowed: boolean;
  children: React.FC<PostRowChildProps>;
  castByline?: React.ReactNode;
  postType?: 'cast';
  timestampVerb?: string;
  link?: string;
}) => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { data } = useNavQuery();
  const editable =
    editAllowed && activity.actor_profile_public.id === data?.profile?.id;
  const [editing, setEditing] = useState(false);
  const [editingReply, setEditingReply] = useState(false);

  const [displayComments, setDisplayComments] = useState(false);

  const commentCount = activity.reply_count;
  const bigQuestion = location.pathname.includes('bigquestion')
    ? undefined
    : activity.big_question;

  const profileId = useProfileId(false);

  const myGive = activity.gives.find(
    give => give.giver_profile_public?.id === profileId
  );

  const invalidateActivities = () => {
    queryClient.invalidateQueries([
      ACTIVITIES_QUERY_KEY,
      [QUERY_KEY_COLINKS, 'activity'],
    ]);
  };

  const invalidatePointsBar = () => {
    queryClient.invalidateQueries([POINTS_QUERY_KEY]);
  };

  const deleteGive = useDeleteGiveMutation({
    giveId: myGive?.id,
    onSuccess: () => {
      invalidateActivities();
      invalidatePointsBar();
    },
  });

  const isCast = postType === 'cast';
  const engagementScore =
    activity.reactions.length + activity.reply_count + activity.gives.length;

  return (
    <>
      {bigQuestion && <BigQuestionCard question={bigQuestion} size="post" />}
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
            background: isCast ? '$surfaceFarcaster' : '$surface',
            p: '$md',
            borderRadius: '$2',
            ...(bigQuestion && {
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }),
            flexGrow: 1,
            '&:hover': {
              '.iconMessage, .iconReaction': {
                'svg * ': {
                  fill: '$link',
                },
              },
              '.giveButton': {
                color: '$link',
              },
            },
            '@sm': {
              p: '$sm',
            },
          }}
        >
          <Flex className="postAvatar">
            <ActivityAvatar
              profile={activity.actor_profile_public}
              css={{ '@sm': { width: '$1xl !important', height: '$1xl' } }}
            />
          </Flex>
          <Flex
            className="clickThrough postContent"
            column
            css={{
              flexGrow: 1,
              ml: '$md',
              position: 'relative',
              '@sm': {
                ml: '$sm',
              },
            }}
          >
            <Flex
              className="clickThrough"
              css={{
                gap: '$sm',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}
            >
              <Flex
                css={{ flexWrap: 'wrap', gap: '$sm', alignItems: 'center' }}
              >
                <ActivityProfileName profile={activity.actor_profile_public} />
                <Text
                  as={link ? Link : NavLink}
                  size="small"
                  css={{
                    color: '$neutral',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                  {...(link
                    ? { target: '_blank', rel: 'noreferrer', href: link }
                    : { to: coLinksPaths.post(activity.id) })}
                >
                  {timestampVerb ? timestampVerb + ' ' : ''}
                  {DateTime.fromISO(activity.created_at).toRelative()}
                </Text>
                {isFeatureEnabled('share_post') && editable && (
                  <SharePostModal activityId={activity.id}>
                    <Link
                      inlineLink
                      color="neutral"
                      css={{
                        fontSize: '$small',
                        gap: '$xs',
                        display: 'inline-flex',
                      }}
                    >
                      <ShareSolid
                        nostroke
                        css={{ path: { fill: '$neutral' } }}
                      />
                      Share
                    </Link>
                  </SharePostModal>
                )}
              </Flex>
              <Flex
                css={{
                  gap: '$sm',
                  justifyContent: 'initial',
                  flexDirection: 'row',
                  flexGrow: 'initial',
                }}
              >
                {editable && (
                  <IconButton onClick={() => setEditing(prev => !prev)}>
                    <Edit />
                  </IconButton>
                )}
                {isCast ? (
                  <>{castByline}</>
                ) : (
                  <PostStats engagementScore={engagementScore} />
                )}
              </Flex>
            </Flex>
            {children({ editing, editable, setEditing })}
            {!editing && (
              <>
                <Flex
                  className="clickThrough"
                  css={{
                    justifyContent: 'space-between',
                    mt: '$sm',
                    alignItems: 'flex-start',
                  }}
                >
                  <Flex
                    css={{
                      alignItems: 'center',
                      gap: '$sm',
                      flexWrap: 'wrap',
                      position: 'relative',
                    }}
                  >
                    <ReactionBar
                      activityId={activity.id}
                      reactions={activity.reactions}
                      drawer={false}
                    />
                    <PostGives
                      gives={activity.gives}
                      clearSkill={() => deleteGive()}
                    />
                  </Flex>
                  <Flex css={{ alignItems: 'center', gap: '$sm' }}>
                    <CoLinksGiveButton
                      isMyPost={activity.actor_profile_public.id === profileId}
                      targetProfileId={activity.actor_profile_public.id}
                      activityId={activity.id}
                      gives={activity.gives}
                      castHash={activity.enriched_cast?.hash}
                    />
                    <Flex className="commentButton">
                      <>
                        {commentCount > 0 ? (
                          <Button
                            color="link"
                            css={{
                              p: '2px $xs',
                              borderRadius: '$1',
                              width: 'auto',
                              minHeight: 0,
                              textDecoration: 'none',
                              '&:hover': {
                                background: '$tagLinkBackground',
                              },
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
                              p: '2px $xs',
                              borderRadius: '$1',
                              width: 'auto',
                              minHeight: 0,
                              '&:hover': {
                                background: '$tagLinkBackground',
                              },
                              '*': {
                                fill: '$secondaryText',
                              },
                            }}
                            onClick={() => setDisplayComments(prev => !prev)}
                          >
                            <Text color="link" className="iconMessage">
                              <Message nostroke />
                            </Text>
                          </Button>
                        )}
                      </>
                    </Flex>
                  </Flex>
                </Flex>
              </>
            )}
            <Flex column className="repliesBox">
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
      </Flex>
    </>
  );
};
