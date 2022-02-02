import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import { Button, ButtonStory } from './Button';

export default {
  title: 'Design System/Components/Button',
  component: Button,
  decorators: [withDesign],
} as ComponentMeta<typeof ButtonStory>;

const Template: ComponentStory<typeof ButtonStory> = args => (
  <Button {...args}>{args.children}</Button>
);

export const SingleButton = Template.bind({});

SingleButton.args = {
  color: 'red',
  size: 'medium',
  children: 'Edit',
};

SingleButton.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/wXF7xGVv1j2SqwWfgbamS8/Coordinape-Design-v8?node-id=338%3A94',
  },
};
