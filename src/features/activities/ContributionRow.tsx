import { useState } from 'react';

import { useNavQuery } from 'features/nav/getNavData';
import { DateTime } from 'luxon';

import { usePathContext } from '../../routes/usePathInfo';
import { Edit, MessageSquare } from 'icons/__generated';
import { ContributionForm } from 'pages/ContributionsPage/ContributionForm';
import { Flex, IconButton, MarkdownPreview, Text } from 'ui';

import { ActivityAvatar } from './ActivityAvatar';
import { ActivityProfileName } from './ActivityProfileName';
import { CircleLogoWithName } from './CircleLogoWithName';
import { ReactionBar } from './reactions/ReactionBar';
import { RepliesBox } from './replies/RepliesBox';
import { Contribution } from './useInfiniteActivities';

export const ContributionRow = ({
  activity,
  drawer,
}: {
  activity: Contribution;
  drawer?: boolean;
}) => {
  const { inCircle } = usePathContext();
  const { data } = useNavQuery();
  const editableContribution =
    activity.actor_profile_public.id === data?.profile?.id;
  const [editingContribution, setEditingContribution] = useState(false);

  const [displayComments, setDisplayComments] = useState(false);

  return (
    <Flex css={{ overflowX: 'clip' }}>
      <Flex
        className="contributionRow"
        alignItems="start"
        css={{
          background: drawer ? '$dim' : '$surface',
          p: drawer ? '$sm $sm $md 0' : '$md',
          borderRadius: '$2',
          flexGrow: 1,
        }}
      >
        {!drawer && <ActivityAvatar profile={activity.actor_profile_public} />}
        <Flex column css={{ flexGrow: 1, ml: '$md', position: 'relative' }}>
          <Flex
            css={{
              gap: '$sm',
              justifyContent: 'space-between',
            }}
          >
            {!drawer && (
              <Flex>
                <ActivityProfileName profile={activity.actor_profile_public} />
                <Text size="small" css={{ color: '$neutral', ml: '$md' }}>
                  {DateTime.fromISO(activity.created_at).toRelative()}
                </Text>
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
                css={{ cursor: 'auto', mt: '$sm' }}
              />
              <Flex css={{ justifyContent: 'space-between' }}>
                <ReactionBar
                  activityId={activity.id}
                  reactions={activity.reactions}
                  drawer={drawer}
                />

                {activity.private_stream && (
                  <IconButton
                    css={{ width: 'auto', pr: '$xs' }}
                    onClick={() => setDisplayComments(prev => !prev)}
                  >
                    {activity.replies_aggregate.aggregate?.count ?? 0}{' '}
                    <MessageSquare css={{ ml: '$sm' }} />
                  </IconButton>
                )}
              </Flex>
            </>
          )}
          {displayComments && (
            <RepliesBox
              activityId={activity.id}
              activityActorId={activity.actor_profile_public.id}
            />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
