import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Box as BoxComponent } from './Box';

export default {
  component: BoxComponent,
} as ComponentMeta<typeof BoxComponent>;

const Template: ComponentStory<typeof BoxComponent> = ({ children, css }) => (
  <BoxComponent css={css}>{children}</BoxComponent>
);

export const Box = Template.bind({});
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
