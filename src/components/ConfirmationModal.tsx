import { ReactNode, useState } from 'react';

import { Modal, Text, Button, Flex } from 'ui';

export const ConfirmationModal = ({
  action,
  description = 'Are you sure you want to proceed?',
  yesText = 'Yes, proceed!',
  cancelText = 'Cancel',
  trigger,
  defaultOpen = false,
}: {
  action: () => void;
  description?: string;
  yesText?: string;
  cancelText?: string;
  trigger: ReactNode;
  defaultOpen?: boolean;
}) => {
  const [visible, setVisible] = useState(defaultOpen);

  const onClose = () => setVisible(prev => !prev);

  return (
    <>
      <Button color="transparent" onClick={() => setVisible(true)}>
        {trigger}
      </Button>
      <Modal open={visible} onOpenChange={onClose} css={{ maxWidth: '440px' }}>
        <Flex column gap={'md'}>
          <Flex css={{ justifyContent: 'center' }}>
            <Text>{description}</Text>
          </Flex>
          <Flex row css={{ justifyContent: 'space-around', gap: '$3xl' }}>
            <Button onClick={onClose}>{cancelText}</Button>
            <Button color="destructive" onClick={action}>
              {yesText}
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
};
