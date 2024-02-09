import { useQuery } from 'react-query';

import { Panel, Text } from '../../ui';

import { getAvailablePoints, MAX_POINTS_CAP } from './getAvailablePoints';

export const PointsBar = () => {
  const { data: points } = useQuery(
    'points',
    async () => {
      return await getAvailablePoints();
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
