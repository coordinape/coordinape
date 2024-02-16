import { useState } from 'react';

import { ACTIVITIES_QUERY_KEY } from 'features/activities/ActivityList';
import { BigQuestionCard } from 'features/BigQuestions/bigQuestions/BigQuestionCard';
import { QUERY_KEY_COLINKS } from 'features/colinks/wizard/CoLinksWizard';
import { useNavQuery } from 'features/nav/getNavData';
import { PostGives } from 'features/points/PostGives';
import { useDeleteGiveMutation } from 'features/points/useDeleteGiveMutation';
import { DateTime } from 'luxon';
import { useQueryClient } from 'react-query';
import { NavLink, useLocation } from 'react-router-dom';

import useProfileId from '../../hooks/useProfileId';
import { coLinksPaths } from '../../routes/paths';
import { PostForm } from '../colinks/PostForm';
import { CoLinksGiveButton } from '../points/CoLinksGiveButton';
import { Edit, Messages, MessageSolid } from 'icons/__generated';
import { Button, Flex, IconButton, MarkdownPreview, Text } from 'ui';

import { ActivityAvatar } from './ActivityAvatar';
import { ActivityProfileName } from './ActivityProfileName';
import { ReactionBar } from './reactions/ReactionBar';
import { RepliesBox } from './replies/RepliesBox';
import { Contribution } from './useInfiniteActivities';

export const PostRow = ({
  activity,
  focus,
}: {
  activity: Contribution;
  focus: boolean;
}) => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { data } = useNavQuery();
  const editableContribution =
    activity.actor_profile_public.id === data?.profile?.id;
  const [editingContribution, setEditingContribution] = useState(false);
  const [editingReply, setEditingReply] = useState(false);

  const [displayComments, setDisplayComments] = useState(false);

  const commentCount = activity.reply_count;
  const bigQuestion = location.pathname.includes('bigquestion')
    ? undefined
    : activity.big_question;

  const profileId = useProfileId(true);

  const myGive = activity.gives.find(
    give => give.giver_profile_public?.id === profileId
  );

  const invalidateActivities = () => {
    queryClient.invalidateQueries([
      ACTIVITIES_QUERY_KEY,
      [QUERY_KEY_COLINKS, 'activity'],
    ]);
  };

  const deleteGive = useDeleteGiveMutation({
    giveId: myGive?.id,
    onSuccess: () => {
      invalidateActivities();
    },
  });

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
            background: '$surface',
            p: '$md',
            borderRadius: '$2',
            ...(bigQuestion && {
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }),
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
          <ActivityAvatar profile={activity.actor_profile_public} />
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
              <Flex css={{ flexWrap: 'wrap', gap: '$sm' }}>
                <ActivityProfileName profile={activity.actor_profile_public} />
                <Text
                  as={NavLink}
                  size="small"
                  to={coLinksPaths.post(activity.id)}
                  css={{
                    color: '$neutral',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {DateTime.fromISO(activity.created_at).toRelative()}
                </Text>
              </Flex>
              <Flex
                css={{
                  gap: '$sm',
                  justifyContent: 'initial',
                  flexDirection: 'row',
                  flexGrow: 'initial',
                }}
              >
                {editableContribution && (
                  <IconButton
                    onClick={() => setEditingContribution(prev => !prev)}
                  >
                    <Edit />
                  </IconButton>
                )}
              </Flex>
            </Flex>
            {editableContribution && (
              <>
                {editingContribution && (
                  <>
                    <PostForm
                      label={'Edit Post'}
                      css={{ textarea: { background: '$surfaceNested ' } }}
                      editContribution={activity.contribution}
                      setEditingContribution={setEditingContribution}
                      placeholder={''}
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
                  css={{ justifyContent: 'space-between', mt: '$sm' }}
                >
                  <Flex css={{ alignItems: 'center' }}>
                    <CoLinksGiveButton
                      isMyPost={activity.actor_profile_public.id === profileId}
                      activityId={activity.id}
                      gives={activity.gives}
                    />
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
                  <Flex>
                    <Flex className="commentButton">
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
                    </Flex>
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
    </>
  );
};
