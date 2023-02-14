import { Flex, Text } from '../../ui';

import type { Activity } from './ActivityItem';

export interface UserActivity extends Activity {
  user?: {
    id: number;
    entrance: string;
    circle_id: number;
    profile: {
      id: number;
      name: string;
      avatar?: string;
    };
  };
}

export const UserActivity = ({ activity }: { activity: UserActivity }) => {
  return (
    <Flex css={{ display: 'block' }}>
      <Text>
        {activity?.user?.profile?.name}
        joined via
        {activity?.user?.entrance}
      </Text>
    </Flex>
  );
};
