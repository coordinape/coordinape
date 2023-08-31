import { useState } from 'react';

import { useNavQuery } from 'features/nav/getNavData';
import { DateTime } from 'luxon';

import { usePathContext } from '../../routes/usePathInfo';
import { Edit } from 'icons/__generated';
import { ContributionForm } from 'pages/ContributionsPage/ContributionForm';
import { Flex, IconButton, MarkdownPreview, Text } from 'ui';

import { ActivityAvatar } from './ActivityAvatar';
import { ActivityProfileName } from './ActivityProfileName';
import { CircleLogoWithName } from './CircleLogoWithName';
import { ReactionBar } from './reactions/ReactionBar';
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
  const editableContribution = activity.actor_profile.id === data?.profile?.id;
  const [editingContribution, setEditingContribution] = useState(false);

  return (
    <Flex css={{ overflowX: 'clip' }}>
      <Flex
        className="contributionRow"
        alignItems="start"
        css={{
          background: drawer ? '$dim' : '$surface',
          p: drawer ? '$sm 0 $md 0' : '$md',
          borderRadius: '$2',
          flexGrow: 1,
        }}
      >
        {!drawer && <ActivityAvatar profile={activity.actor_profile} />}
        <Flex column css={{ flexGrow: 1, ml: '$md', position: 'relative' }}>
          <Flex
            css={{
              gap: '$sm',
              justifyContent: 'space-between',
            }}
          >
            {!drawer && (
              <Flex>
                <ActivityProfileName profile={activity.actor_profile} />
                <Text size="small" css={{ color: '$neutral', ml: '$md' }}>
                  {DateTime.fromISO(activity.created_at).toRelative()}
                </Text>
              </Flex>
            )}
            <Flex css={{ gap: '$sm' }}>
              {editableContribution && (
                <IconButton
                  onClick={() => setEditingContribution(prev => !prev)}
                >
                  <Edit />
                </IconButton>
              )}
              {!inCircle && (
                <Flex
                  css={{
                    borderLeft: editableContribution
                      ? '1px solid $border'
                      : 'none',
                    pl: 'calc($sm + $xs)',
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
                <ContributionForm
                  css={{ textarea: { background: '$surfaceNested ' } }}
                  description={activity.contribution.description}
                  setEditingContribution={setEditingContribution}
                  contributionId={activity.contribution.id}
                  circleId={activity.circle.id}
                />
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
              <ReactionBar
                activityId={activity.id}
                reactions={activity.reactions}
                drawer={drawer}
              />
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
