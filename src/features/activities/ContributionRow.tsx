import { useState } from 'react';

import { useNavQuery } from 'features/nav/getNavData';
import { DateTime } from 'luxon';

import { usePathContext } from '../../routes/usePathInfo';
import { Edit } from 'icons/__generated';
import { ContributionForm } from 'pages/ContributionsPage/ContributionForm';
import { Box, Flex, IconButton, MarkdownPreview, Text } from 'ui';

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
  const editableContribution =
    activity.actor_profile.address === data?.profile?.address;
  const [editContribution, setEditContribution] = useState(false);

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
            {!inCircle && (
              <CircleLogoWithName
                circle={activity.circle}
                reverse={drawer ? false : true}
              />
            )}
          </Flex>
          {editableContribution && (
            <>
              {editContribution ? (
                <ContributionForm
                  description={activity.contribution.description}
                  setEditContribution={setEditContribution}
                  contributionId={activity.contribution.id}
                />
              ) : (
                <Box css={{ position: 'absolute', right: '-$xs', top: '-$xs' }}>
                  <IconButton onClick={() => setEditContribution(true)}>
                    <Edit />
                  </IconButton>
                </Box>
              )}
            </>
          )}
          {!editContribution && (
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
