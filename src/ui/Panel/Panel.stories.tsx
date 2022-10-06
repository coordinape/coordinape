import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import { Select } from '../Select/Select';
import { TextArea } from '../TextArea/TextArea';

import { Panel as PanelComponent } from './Panel';

export default {
  title: 'Design System/Components/Panel',
  component: PanelComponent,
  decorators: [withDesign, Story => <Story />],
} as ComponentMeta<typeof PanelComponent>;

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
];

const Template: ComponentStory<typeof PanelComponent> = args => (
  <PanelComponent {...args}>
    <Select options={options} />
    <TextArea
      css={{
        mt: '$md',
      }}
      value={
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum dolor libero, mattis eu eros in, convallis consequat justo. Suspendisse at metus mattis, interdum tellus interdum, lobortis orci. Maecenas molestie tempus erat in ultricies. Nulla convallis massa non ipsum lobortis maximus vitae non ligula.'
      }
    />
  </PanelComponent>
);

export const Panel = Template.bind({});

export const StackPanel = Template.bind({});
StackPanel.args = { stack: true };

export const NestedPanel = Template.bind({});
NestedPanel.args = { nested: true };

export const InvertFormPanel = Template.bind({});
InvertFormPanel.args = { invertForm: true };

export const InfoPanel = Template.bind({});
InfoPanel.args = { info: true };

export const SuccessPanel = Template.bind({});
SuccessPanel.args = { success: true };

export const AlertPanel = Template.bind({});
AlertPanel.args = { alert: true };

export const BackgroundPanel = Template.bind({});
BackgroundPanel.args = { background: true };
