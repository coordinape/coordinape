import { useState } from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Check, Slash, X } from 'icons/__generated';

import { Flex, ToggleButton as ToggleButtonComponent } from './index';

export default {
  title: 'Design System/Components/Toggle Button',
  component: ToggleButtonComponent,
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
    ref: {
      table: {
        disable: true,
      },
    },
    as: {
      table: {
        disable: true,
      },
    },
    css: {
      table: {
        disable: true,
      },
    },
    color: {
      table: {
        disable: true,
      },
    },
    active: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof ToggleButtonComponent>;

const Template: ComponentStory<typeof ToggleButtonComponent> = () => {
  const [index, setIndex] = useState(0);

  return (
    <Flex css={{ flexWrap: 'wrap', gap: '$sm' }}>
      <ToggleButtonComponent
        color="complete"
        active={index === 0}
        name={'yes'}
        onClick={e => {
          e.preventDefault();
          setIndex(0);
        }}
      >
        <Check size="lg" /> Yes
      </ToggleButtonComponent>
      <ToggleButtonComponent
        color="destructive"
        active={index === 1}
        name={'no'}
        onClick={e => {
          e.preventDefault();
          setIndex(1);
        }}
      >
        <X size="lg" /> No
      </ToggleButtonComponent>
      <ToggleButtonComponent
        color="destructive"
        active={index === 2}
        name={'cancel'}
        onClick={e => {
          e.preventDefault();
          setIndex(2);
        }}
      >
        <Slash size="lg" /> Cancel
      </ToggleButtonComponent>
    </Flex>
  );
};

export const ToggleButton = Template.bind({});

ToggleButton.parameters = {
  controls: { hideNoControlsWarning: true },
};
