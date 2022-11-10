import { ReactNode } from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import { fadeIn, fadeOut, slideInRight, slideOutRight } from 'keyframes';
import { CSS, styled } from 'stitches.config';

import { X } from 'icons/__generated';

const Overlay = styled(Dialog.Overlay, {
  backgroundColor: '#00000080',
  position: 'fixed',
  inset: 0,
  display: 'grid',
  alignItems: 'start',
  overflowY: 'auto',
  "&[data-state='open']": {
    animation: `${fadeIn} .5s ease`,
  },
  "&[data-state='closed']": {
    animation: `${fadeOut} .5s ease`,
  },
});

const Close = styled(Dialog.Close, {
  position: 'absolute',
  right: 'calc($sm + 3px)',
  top: 'calc($sm + 3px)',
  cursor: 'pointer',
});

const Content = styled(Dialog.Content, {
  backgroundColor: '$white',
  borderRadius: '$3',
  width: '90vw',
  maxWidth: '650px',
  padding: '$2xl',
  margin: 'calc($xl * 2) auto $xl',
  position: 'relative',
  variants: {
    drawer: {
      true: {
        backgroundColor: '$surface',
        right: 0,
        margin: 0,
        borderRadius: 0,
        height: '100vh',
        position: 'fixed',
        p: '$md $lg',
        overflowY: 'scroll',
        "&[data-state='open']": {
          animation: `${slideInRight} .4s ease-out`,
        },
        "&[data-state='closed']": {
          animation: `${slideOutRight} .4s ease-in`,
        },
      },
    },
  },
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
  css?: CSS;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showClose?: boolean;
  drawer?: boolean;
};
export const Modal = ({
  children,
  title,
  onOpenChange,
  css = {},
  defaultOpen = false,
  open = true,
  showClose = true,
  drawer,
}: ModalProps) => {
  return (
    <Dialog.Root
      modal
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Dialog.Portal>
        <Overlay />
        <Content drawer={drawer} css={css}>
          {(showClose || showClose === undefined) && (
            <Close>
              <X size="lg" />
            </Close>
          )}
          {title && <Title>{title}</Title>}
          {children}
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
