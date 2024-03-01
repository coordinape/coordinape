import {
  Button,
  Flex,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '../../ui';
import { BatteryLow, GemCoOutline } from 'icons/__generated';

import { PointsBar } from './PointsBar';
import { usePoints } from './usePoints';

export const GiveAvailablePopover = ({
  giveCharging = false,
}: {
  giveCharging?: boolean;
}) => {
  const { give } = usePoints();

  if (giveCharging) {
    return (
      <Popover>
        <PopoverTrigger css={{ cursor: 'pointer' }}>
          <Button
            as="span"
            color="dim"
            size="small"
            css={{
              p: '3px 7px',
              height: 'auto',
              minHeight: 0,
              fontSize: '$small',
              borderRadius: '4px',
              '&:hover': {
                background: '$tagCtaBackground',
                color: '$tagCtaText',
              },
            }}
          >
            <BatteryLow fa size="md" css={{ ml: '$xs' }} />
            GIVE
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          css={{
            background: '$surface',
            width: 270,
            p: '$md',
            mt: 5,
            gap: '$sm',
          }}
        >
          <Text semibold>You are currently out of GIVE</Text>
          <Text size="small">Give more once your GIVE bar has charged!</Text>
          <Flex column css={{ mt: '$md' }}>
            <PointsBar barOnly />
          </Flex>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover>
      <PopoverTrigger css={{ cursor: 'pointer' }}>
        <IconButton as="span" css={{ width: 'auto' }}>
          {give}
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
