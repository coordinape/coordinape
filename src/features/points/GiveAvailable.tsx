import {
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '../../ui';
import { GemCoFill } from 'icons/__generated';

import { PointsBar } from './PointsBar';

export const GiveAvailable = () => {
  return (
    <Popover>
      <PopoverTrigger css={{ cursor: 'pointer' }}>
        <IconButton css={{ width: 'auto' }}>
          4
          <GemCoFill fa size="lg" css={{ ml: '$xs' }} />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        css={{
          background: '$dim',
          mt: '$sm',
          p: '$sm $sm',
        }}
      >
        <Text
          variant="label"
          css={{
            color: '$complete',
            borderBottom: '0.5px solid $border',
            pb: '$xs',
            mb: '$sm',
          }}
        >
          <PointsBar />
        </Text>
      </PopoverContent>
    </Popover>
  );
};
