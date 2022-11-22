import { useState } from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Text } from '../Text/Text';
import { Box, Button } from 'ui';

import {
  Popover as PopoverComponent,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  POPOVER_TIMEOUT,
} from './Popover';

export default {
  component: PopoverComponent,
} as ComponentMeta<typeof PopoverComponent>;

const Template: ComponentStory<typeof PopoverComponent> = () => {
  const [mouseEnterPopover, setMouseEnterPopover] = useState(false);

  let timeoutId: ReturnType<typeof setTimeout>;

  const onMouseEnter = () => {
    clearTimeout(timeoutId);
    setMouseEnterPopover(true);
  };

  const onMouseLeave = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => setMouseEnterPopover(false), POPOVER_TIMEOUT);
  };

  return (
    <PopoverComponent open={mouseEnterPopover}>
      <PopoverTrigger>
        <Button
          as="a"
          size="small"
          color="surface"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          Popover Trigger
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        align="start"
        css={{
          mt: '$xs',
        }}
      >
        <Box
          css={{
            flexDirection: 'column',
            p: '$md',
          }}
        >
          <PopoverClose
            asChild
            onClick={() => {
              setMouseEnterPopover(false);
            }}
          >
            <Text size="small">Click here to close immediately</Text>
          </PopoverClose>
          <Text css={{ mt: '$md' }}>
            Popover Content - Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Quisque non neque ipsum.
          </Text>
        </Box>
      </PopoverContent>
    </PopoverComponent>
  );
};

export const Popover = Template.bind({});
