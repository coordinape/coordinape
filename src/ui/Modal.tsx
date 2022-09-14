import { ReactNode } from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import { CSS, styled } from 'stitches.config';

import X from 'icons/__generated/X';
import { Button } from 'ui';

const Overlay = styled(Dialog.Overlay, {
  backgroundColor: '#00000080',
  position: 'fixed',
  inset: 0,
  display: 'grid',
  alignItems: 'start',
  overflowY: 'auto',
});

const Content = styled(Dialog.Content, {
  backgroundColor: '$white',
  borderRadius: '$3',
  width: '90vw',
  maxWidth: '650px',
  padding: '$2xl',
  margin: 'calc($xl * 2) auto $xl',
  position: 'relative',
});

const Title = styled(Dialog.Title, {
  fontSize: '$h2',
  fontWeight: '$bold',
  display: 'block',
  marginTop: 'calc($sm * -1)',
  color: '$text',
});

type ModalProps = {
  children: ReactNode;
  title?: string;
  onClose: () => void;
  css?: CSS;
  open?: boolean;
  showClose?: boolean;
};
export const Modal = ({
  children,
  title,
  onClose,
  css = {},
  open = true,
  showClose,
}: ModalProps) => {
  return (
    <Dialog.Root defaultOpen modal open={open}>
      <Dialog.Portal>
        <Overlay>
          <Content css={css}>
            {(showClose || showClose === undefined) && (
              <Button
                color="transparent"
                onClick={onClose}
                css={{
                  position: 'absolute',
                  right: 'calc($sm + 3px)',
                  top: '$sm',
                  fontSize: '$h3',
                }}
              >
                <X size="lg" />
              </Button>
            )}
            {title && <Title>{title}</Title>}
            {children}
          </Content>
        </Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
