import { Modal } from 'ui';

import { LoadingIndicator } from './LoadingIndicator';

const loadingSize = 64;

export const LoadingModal = (props: {
  visible: boolean;
  onClose?: () => void;
  text?: string;
  note?: string;
}) => {
  const { onClose, note, text, visible } = props;

  return (
    <Modal loader open={visible} onOpenChange={onClose}>
      <LoadingIndicator text={text} note={note} size={loadingSize} />
    </Modal>
  );
};
