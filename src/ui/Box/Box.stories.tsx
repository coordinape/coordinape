import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import { Box as BoxComponent } from './Box';

export default {
  title: 'Design System/Components/Box',
  component: BoxComponent,
  decorators: [withDesign, Story => <Story />],
  argTypes: {
    ref: {
      table: {
        disable: true,
      },
    },
    css: {
      table: {
        disable: true,
      },
    },
    as: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof BoxComponent>;

const Template: ComponentStory<typeof BoxComponent> = ({ children, css }) => (
  <BoxComponent css={css}>{children}</BoxComponent>
);

export const Box = Template.bind({});
Box.parameters = {
  controls: { hideNoControlsWarning: true },
};
Box.args = {
  children:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed odio arcu, tempor nec urna vel, malesuada vestibulum tortor. Ut pulvinar ut eros in ullamcorper. Ut ac dui in nunc tincidunt aliquam. Morbi eu dui lacus. Quisque laoreet purus sit amet libero laoreet porttitor. Suspendisse id tortor vitae turpis dapibus dignissim. Vivamus egestas tortor eu tellus suscipit sollicitudin. Integer purus nunc, semper faucibus erat eget, porta aliquet elit. Etiam facilisis pretium sagittis. Curabitur laoreet quam et quam eleifend placerat.',
  css: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 0,
    color: '$white',
    background: '$black',
    padding: '$xl',
  },
};

export const TruncatingBox = Template.bind({});
TruncatingBox.args = {
  children: 'verylongtext',
  css: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: '',
    color: '$text',
    fontSize: '$h2',
    fontWeight: '$bold',
    width: 100,
  },
};
