import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Text } from 'ui';

import HRComponent from './HR';

export default {
  component: HRComponent,
} as ComponentMeta<typeof HRComponent>;

const Template: ComponentStory<typeof HRComponent> = () => (
  <>
    <Text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin consectetur
      eros id justo dignissim, ut accumsan sem feugiat.
    </Text>
    <HRComponent css={{ mt: '$md', mb: '$md' }} />
    <Text>Proin dignissim arcu nibh, id fringilla lorem cursus non.</Text>
  </>
);

export const HR = Template.bind({});
