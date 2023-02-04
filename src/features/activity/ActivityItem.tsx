import { DateTime } from 'luxon';

import { Avatar, Flex, Text } from '../../ui';

interface Activity {
  id: number;
  description: string;
  created_at: string;
  user: {
    name: string;
    profile: {
      name: string;
      avatar?: string;
    };
  };
}

export const ActivityItem = ({ activity }: { activity: Activity }) => {
  return (
    <Flex alignItems="center">
      <Avatar
        css={{ flexShrink: 0 }}
        name={activity.user.profile.name ?? activity.user.name}
        path={activity.user.profile.avatar}
      />
      <Flex column css={{ flexGrow: 1, ml: '$md' }}>
        <Flex css={{ gap: '$sm' }}>
          <Text variant="label">
            {activity.user.profile.name ?? activity.user.name}
          </Text>
          <Text color="secondary" size="small">
            Contribution
          </Text>
          <Text size="small" css={{ color: '$neutral' }}>
            {DateTime.fromISO(activity.created_at).toRelative()}
          </Text>
        </Flex>

        <Text>{activity.description}</Text>
      </Flex>
    </Flex>
  );
};
