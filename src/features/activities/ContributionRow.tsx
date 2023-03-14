import { DateTime } from 'luxon';
import { NavLink } from 'react-router-dom';

import { usePathContext } from '../../routes/usePathInfo';
import { Flex, MarkdownPreview, Text } from '../../ui';
import { paths } from 'routes/paths';

import { ActivityAvatar } from './ActivityAvatar';
import { ActivityProfileName } from './ActivityProfileName';
import { ReactionBar } from './ReactionBar';
import { Contribution } from './useInfiniteActivities';

export const ContributionRow = ({ activity }: { activity: Contribution }) => {
  const { inCircle } = usePathContext();

  return (
    <Flex alignItems="start">
      <ActivityAvatar profile={activity.actor_profile} />
      <Flex column css={{ flexGrow: 1, ml: '$md' }}>
        <Flex css={{ gap: '$sm' }}>
          <ActivityProfileName profile={activity.actor_profile} />
          <Text color="secondary" size="small">
            Contribution
            {!inCircle && ' to'}
          </Text>
          {!inCircle && (
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
        <ReactionBar activityId={activity.id} reactions={activity.reactions} />
      </Flex>
    </Flex>
  );
};
