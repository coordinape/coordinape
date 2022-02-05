import { ComponentStory, ComponentMeta } from '@storybook/react';

import { TextArea } from './TextArea';

export default {
  title: 'Design System/Components/TextArea',
  component: TextArea,
} as ComponentMeta<typeof TextArea>;

const Template: ComponentStory<typeof TextArea> = args => (
  <TextArea {...args}>{args.children}</TextArea>
);

export const SingleTextArea = Template.bind({});

SingleTextArea.args = {};
