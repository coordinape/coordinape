import { DateTime } from 'luxon';
import { NavLink } from 'react-router-dom';

import { paths } from '../../routes/paths';
import { Flex, MarkdownPreview, Text } from '../../ui';

import { ActivityAvatar } from './ActivityAvatar';
import { DisplayContext } from './ActivityList';
import { ActivityProfileName } from './ActivityProfileName';
import { Contribution } from './useInfiniteActivities';

export const ContributionRow = ({
  activity,
  displayContext,
}: {
  activity: Contribution;
  displayContext: DisplayContext;
}) => {
  return (
    <Flex alignItems="center">
      <ActivityAvatar profile={activity.actor_profile} />
      <Flex column css={{ flexGrow: 1, ml: '$md' }}>
        <Flex css={{ gap: '$sm' }}>
          <ActivityProfileName profile={activity.actor_profile} />
          <Text color="secondary" size="small">
            Contribution to
          </Text>
          {displayContext.showCircleInfo && (
            <Text
              semibold
              inline
              color="cta"
              size="small"
              as={NavLink}
              to={paths.history(activity.circle.id)}
              css={{ textDecoration: 'none' }}
            >
              {activity.circle.name}
            </Text>
          )}
          <Text size="small" css={{ color: '$neutral' }}>
            {DateTime.fromISO(activity.created_at).toRelative()}
          </Text>
        </Flex>

        <MarkdownPreview
          render
          source={activity.contribution.description}
          css={{ cursor: 'auto' }}
        />
      </Flex>
    </Flex>
  );
};
