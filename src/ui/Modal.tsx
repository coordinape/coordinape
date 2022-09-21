import { ReactNode } from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import { CSS, keyframes, styled } from 'stitches.config';
// import { useTransition, animated, config } from 'react-spring';

import { X } from 'icons/__generated';
import { Button } from 'ui';

const slideIn = keyframes({
  from: {
    right: '-650px',
  },
  to: {
    right: 0,
  },
});
const slideOut = keyframes({
  from: {
    right: 0,
  },
  to: {
    right: '-650px',
  },
});

const fadeIn = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

const Overlay = styled(Dialog.Overlay, {
  backgroundColor: '#00000080',
  position: 'fixed',
  inset: 0,
  display: 'grid',
  alignItems: 'start',
  overflowY: 'auto',
  animation: `${fadeIn} .3s ease`,
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
        // animation: `${slideIn} .4s ease`,
        // .dialog-overlay[data-state='open'],
        "&[data-state='open']": {
          animation: `${slideIn} 3.4s ease`,
        },
        "&[data-state='closed']": {
          animation: `${slideOut} 3.4s ease`,
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

// const transitions = useTransition(open, {
//   from: { opacity: 0, y: -10 },
//   enter: { opacity: 1, y: 0 },
//   leave: { opacity: 0, y: 10 },
//   config: config.stiff,
// });

type ModalProps = {
  children: ReactNode;
  title?: string;
  onClose: () => void;
  css?: CSS;
  open?: boolean;
  showClose?: boolean;
  drawer?: boolean;
};
export const Modal = ({
  children,
  title,
  onClose,
  css = {},
  open = true,
  showClose,
  drawer,
}: ModalProps) => {
  return (
    <Dialog.Root defaultOpen modal open={open}>
      <Dialog.Portal>
        <Overlay forceMount onClick={onClose}>
          <Content forceMount drawer={drawer} css={css}>
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
