import { Flex, Text } from '../../ui';

import type { Activity } from './ActivityItem';

export interface EpochActivity extends Activity {
  epoch?: {
    id: number;
    description: string;
    start_date: string;
    end_date: string;
    ended: string;
    circle: {
      id: number;
      name: string;
    };
  };
}

export const EpochActivity = ({ activity }: { activity: EpochActivity }) => {
  return (
    <Flex css={{ display: 'block' }}>
      <Text>Epoch starts at {activity?.epoch?.start_date}</Text>
    </Flex>
  );
};
