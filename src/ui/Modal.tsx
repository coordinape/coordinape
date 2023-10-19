import { ReactNode } from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import { fadeIn, fadeOut, slideInRight, slideOutRight } from 'keyframes';
import { CSS, dark, theme as light, styled } from 'stitches.config';

import { X } from 'icons/__generated';

const Overlay = styled(Dialog.Overlay, {
  backgroundColor: '$modalBackground',
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

const OverlayClose = styled(Dialog.Close);

const Close = styled(Dialog.Close, {
  position: 'absolute',
  right: 'calc($sm + 3px)',
  top: 'calc($sm + 3px)',
  cursor: 'pointer',
  color: '$text',
  '@sm': { outline: 'none !important' },
});

const Content = styled(Dialog.Content, {
  backgroundColor: '$surface',
  border: '1px solid',
  borderColor: '$modalBorderColor',
  boxShadow: '$modalShadow',
  borderRadius: '$3',
  width: '90vw',
  maxWidth: '650px',
  maxHeight: '100vh',
  overflow: 'auto',
  padding: '$2xl',
  margin: 'calc($xl * 2) auto $xl',
  position: 'relative',
  color: '$text',
  '@sm': { mt: 0, p: '$lg $md', maxHeight: `calc(100vh - $xl)` },
  variants: {
    drawer: {
      true: {
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
    loader: {
      true: {
        background: 'transparent',
        m: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 'none',
        height: '100vh',
        border: 'none',
        borderRadius: '0',
        position: 'fixed',
        top: 0,
      },
    },
  },
});

const Title = styled(Dialog.Title, {
  fontSize: '$h2',
  display: 'block',
  color: '$text',
  fontWeight: '$semibold',
});

type ModalProps = {
  children: ReactNode;
  title?: string;
  forceTheme?: string;
  css?: CSS;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showClose?: boolean;
  drawer?: boolean;
  loader?: boolean;
};
export const Modal = ({
  children,
  title,
  forceTheme,
  onOpenChange,
  css = {},
  defaultOpen = false,
  open = true,
  showClose = true,
  drawer,
  loader,
}: ModalProps) => {
  return (
    <Dialog.Root
      modal
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Dialog.Portal>
        <OverlayClose>
          <Overlay />
        </OverlayClose>
        <Content
          className={
            forceTheme === 'dark' ? dark : forceTheme === 'light' ? light : ''
          }
          drawer={drawer}
          css={css}
          loader={loader}
          onPointerDownOutside={event => {
            event.preventDefault();
          }}
          onInteractOutside={event => {
            event.preventDefault();
          }}
        >
          {showClose !== false && !loader && (
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
