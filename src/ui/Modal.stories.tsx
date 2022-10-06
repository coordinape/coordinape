import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Flex, Text, Button, Modal as ModalComponent } from './index';

export default {
  title: 'Design System/Components/Modal',
  component: ModalComponent,
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
    onClose: {
      table: {
        disable: true,
      },
    },
    onOpenChange: {
      table: {
        disable: true,
      },
    },
    defaultOpen: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof ModalComponent>;

const Template: ComponentStory<typeof ModalComponent> = args => (
  <ModalComponent {...args} />
);

export const Modal = Template.bind({});

Modal.args = {
  title: 'Modal Title',
  showClose: true,
  drawer: false,
  open: true,
  children: (
    <Flex column alignItems="start" css={{ gap: '$md' }}>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut tortor
        nec neque fringilla auctor ut eu augue. Mauris sem tellus, vehicula a
        tincidunt quis, euismod eget sapien.
      </Text>
      <Button color="primary" onClick={() => {}}>
        Button
      </Button>
    </Flex>
  ),
};
