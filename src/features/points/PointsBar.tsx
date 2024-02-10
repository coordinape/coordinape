import { useQuery } from 'react-query';

import { Panel, Text } from '../../ui';

import { MAX_POINTS_CAP } from './getAvailablePoints';
import { getMyAvailablePoints } from './getMyAvailablePoints';

export const PointsBar = () => {
  const { data: points } = useQuery(
    'points',
    async () => {
      return await getMyAvailablePoints();
    },
    {
      onError: error => {
        console.error(error);
      },
    }
  );

  return (
    <Panel>
      <progress id="points" max={MAX_POINTS_CAP} value={points} />
      <Text>{points}</Text>
    </Panel>
  );
};
