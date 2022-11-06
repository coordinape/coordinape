import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Text } from 'ui';

import DividerComponent from './Divider';

export default {
  component: DividerComponent,
} as ComponentMeta<typeof DividerComponent>;

const Template: ComponentStory<typeof DividerComponent> = () => (
  <>
    <Text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin consectetur
      eros id justo dignissim, ut accumsan sem feugiat.
    </Text>
    <DividerComponent css={{ mt: '$md', mb: '$md' }} />
    <Text>Proin dignissim arcu nibh, id fringilla lorem cursus non.</Text>
  </>
);

export const Divider = Template.bind({});
