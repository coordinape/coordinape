import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Text } from '../Text/Text';
import { Info } from 'icons/__generated';

import { Tooltip as TooltipComponent } from './Tooltip';

export default {
  title: 'Design System/Components/Tooltip',
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
