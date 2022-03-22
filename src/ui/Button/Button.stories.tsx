import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import { Box } from '../Box/Box';

import { Button, ButtonStory } from './Button';

export default {
  title: 'Design System/Components/Button',
  component: Button,
  decorators: [withDesign],
} as ComponentMeta<typeof ButtonStory>;

const Template: ComponentStory<typeof ButtonStory> = args => (
  <Box css={{ display: 'flex', gap: '$sm' }}>
    <Button size="small" {...args}>
      Small {args.children}
    </Button>
    <Button size="medium" {...args}>
      Medium {args.children}
    </Button>
    <Button size="large" {...args}>
      Large {args.children}
    </Button>
  </Box>
);

export const SingleButton = Template.bind({});

SingleButton.args = {
  color: 'red',
  children: 'Button',
};

SingleButton.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/wXF7xGVv1j2SqwWfgbamS8/Coordinape-Design-v8?node-id=338%3A94',
  },
};
