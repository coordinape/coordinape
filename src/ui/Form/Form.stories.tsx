import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Form as FormComponent } from './Form';

export default {
  title: 'Design System/Components/Form',
  component: FormComponent,
  argTypes: {
    children: {
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
      disable: true,
    },
    ref: {
      disable: true,
    },
  },
} as ComponentMeta<typeof FormComponent>;

const Template: ComponentStory<typeof FormComponent> = () => (
  <FormComponent
    css={{
      dark: '(prefers-color-scheme: dark)',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <input placeholder="UserName"></input>
    <input placeholder="Age"></input>
    <input placeholder="Email"></input>
    <button type="submit"> Submit </button>
  </FormComponent>
);

export const Form = Template.bind({});
Form.parameters = {
  controls: { hideNoControlsWarning: true },
};
