import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Info } from 'icons/__generated';
import { Text } from 'ui';

import { Tooltip as TooltipComponent } from './Tooltip';

export default {
  component: TooltipComponent,
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
    css: {
      table: {
        disable: true,
      },
    },
    content: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof TooltipComponent>;

const Template: ComponentStory<typeof TooltipComponent> = () => (
  <TooltipComponent
    content={
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
        lobortis consequat orci, quis feugiat sem suscipit sed.
      </Text>
    }
  >
    <Info />
  </TooltipComponent>
);

export const Tooltip = Template.bind({});
Tooltip.parameters = {
  controls: { hideNoControlsWarning: true },
};
