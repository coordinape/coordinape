import { Modal } from './Modal';

export const DrawerModal = ({
  children,
  visible,
  onClose,
}: {
  children: React.ReactNode;
  visible: boolean;
  onClose(): void;
}) => {
  return (
    <Modal
      drawer
      open={visible}
      onOpenChange={onClose}
      css={{
        maxWidth: 'calc(490px + $md + $md)',
        p: 0,
        border: 'none',
        background: '$background',
        borderRadius: '$3',
        mr: '$md',
        maxHeight: 'calc(100vh - $xl)',
        pb: '$xl',
      }}
    >
      {children}
    </Modal>
  );
};
