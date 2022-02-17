import { useArgs } from '@storybook/client-api';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import { Checkbox } from './Checkbox';

export default {
  title: 'Design System/Components/Checkbox',
  component: Checkbox,
  decorators: [withDesign],
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = args => {
  const [{ checked }, updateArgs] = useArgs();
  const handleOnCheckedChange = () => updateArgs({ checked: !checked });

  return (
    <Checkbox {...args} onCheckedChange={handleOnCheckedChange}>
      {args.children}
    </Checkbox>
  );
};

export const SingleCheckbox = Template.bind({});
SingleCheckbox.args = {
  label: 'Fund monthly',
  checked: false,
  onCheckedChange: () => {},
};

SingleCheckbox.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/wXF7xGVv1j2SqwWfgbamS8/App-1.0?node-id=4147%3A8740',
  },
};
