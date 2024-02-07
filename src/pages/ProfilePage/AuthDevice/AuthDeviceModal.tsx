import { Modal } from 'ui';

import { AuthDeviceForm } from './AuthDeviceForm';

export const AuthDeviceModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose?: () => void;
}) => {
  return (
    <Modal
      css={{ mt: '10px', pt: '$lg', pb: '$lg', maxHeight: '95vh' }}
      open={visible}
      onOpenChange={onClose}
    >
      <AuthDeviceForm />
    </Modal>
  );
};
