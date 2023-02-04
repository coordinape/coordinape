import { DateTime } from 'luxon';

import { Avatar, Flex, Text } from '../../ui';

import { Contribution } from './getActivities';

export const ContributionRow = ({ activity }: { activity: Contribution }) => {
  return (
    <Flex alignItems="center">
      <Avatar
        css={{ flexShrink: 0 }}
        name={activity.actor_profile.name}
        path={activity.actor_profile.avatar}
      />
      <Flex column css={{ flexGrow: 1, ml: '$md' }}>
        <Flex css={{ gap: '$sm' }}>
          <Text variant="label">{activity.actor_profile.name}</Text>
          <Text color="secondary" size="small">
            Contribution
          </Text>
          <Text size="small" css={{ color: '$neutral' }}>
            {DateTime.fromISO(activity.created_at).toRelative()}
          </Text>
        </Flex>

        <Text>{activity.contribution.description}</Text>
      </Flex>
    </Flex>
  );
};
