import { useQuery } from 'react-query';

import { IconButton, Popover, PopoverContent, PopoverTrigger } from '../../ui';
import { GemCoOutline } from 'icons/__generated';

import { POINTS_PER_GIVE } from './getAvailablePoints';
import { getMyAvailablePoints } from './getMyAvailablePoints';
import { POINTS_QUERY_KEY, PointsBar } from './PointsBar';

export const GiveAvailablePopover = () => {
  const { data: points } = useQuery(
    [POINTS_QUERY_KEY],
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
    <Popover>
      <PopoverTrigger css={{ cursor: 'pointer' }}>
        <IconButton as="span" css={{ width: 'auto' }}>
          {points && Math.floor(points / POINTS_PER_GIVE)}
          <GemCoOutline fa size="lg" css={{ ml: '$xs' }} />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        css={{
          background: '$surface',
          p: 0,
          width: 270,
          mt: 5,
        }}
      >
        <PointsBar open />
      </PopoverContent>
    </Popover>
  );
};
