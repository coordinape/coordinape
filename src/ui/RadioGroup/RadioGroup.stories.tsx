import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Flex, Text } from 'ui';

import {
  RadioGroupIndicator,
  RadioGroupRadio,
  RadioGroupRoot as RadioGroupRootComponent,
} from './RadioGroup';

export default {
  component: RadioGroupRootComponent,
} as ComponentMeta<typeof RadioGroupRootComponent>;

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
];

const Template: ComponentStory<typeof RadioGroupRootComponent> = args => (
  <RadioGroupRootComponent
    css={{
      display: 'flex',
      gap: '$md',
    }}
    defaultValue={options[0].value}
    {...args}
  >
    {options.map(({ value, label }) => (
      <Flex key={value} css={{ alignItems: 'center', gap: '$xs' }}>
        <RadioGroupRadio value={value} id={value}>
          <RadioGroupIndicator />
        </RadioGroupRadio>
        <Text variant="label" as="label" htmlFor={value}>
          {label}
        </Text>
      </Flex>
    ))}
  </RadioGroupRootComponent>
);

export const RadioGroup = Template.bind({});
