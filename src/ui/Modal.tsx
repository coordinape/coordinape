import { ReactNode } from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import { CSS, styled } from 'stitches.config';

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
  fontSize: '$8',
  fontWeight: '$bold',
  display: 'block',
  textAlign: 'center',
  marginTop: 'calc($sm * -1)',
  color: '$text',
});

type ModalProps = {
  children: ReactNode;
  title?: string;
  onClose: () => void;
  css?: CSS;
  open?: boolean;
};
export const Modal = ({
  children,
  title,
  onClose,
  css = {},
  open = true,
}: ModalProps) => {
  return (
    <Dialog.Root defaultOpen modal open={open}>
      <Dialog.Portal>
        <Overlay>
          <Content css={css}>
            <Button
              color="transparent"
              onClick={onClose}
              css={{
                position: 'absolute',
                right: 'calc($sm + 3px)',
                top: '$sm',
                fontSize: '$7',
              }}
            >
              &#x2715;
            </Button>
            {title && <Title>{title}</Title>}
            {children}
          </Content>
        </Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
