import { DateTime } from 'luxon';

import { Flex, MarkdownPreview, Text } from '../../ui';

import { ActivityAvatar } from './ActivityAvatar';
import { ActivityProfileName } from './ActivityProfileName';
import { Contribution } from './useInfiniteActivities';

export const ContributionRow = ({ activity }: { activity: Contribution }) => {
  return (
    <Flex alignItems="center">
      <ActivityAvatar profile={activity.actor_profile} />
      <Flex column css={{ flexGrow: 1, ml: '$md' }}>
        <Flex css={{ gap: '$sm' }}>
          <ActivityProfileName profile={activity.actor_profile} />
          <Text color="secondary" size="small">
            Contribution
          </Text>
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
