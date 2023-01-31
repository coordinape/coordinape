import { useState } from 'react';

import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { CSS, keyframes, styled } from 'stitches.config';

import useMobileDetect from 'hooks/useMobileDetect';
import { Flex, Link, Modal } from 'ui';

const scaleUpAnimation = keyframes({
  '0%': { opacity: 0, transform: 'scale(0)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});

/** **NOTE**: The hover card is intended for mouse users only. */
const HoverCardContent = styled(HoverCardPrimitive.Content, {
  borderRadius: '$2',
  padding: '$sm',
  fontSize: '$small',
  '*': {
    lineHeight: '$shorter',
  },
  fontWeight: '$normal',
  maxWidth: 240,
  boxShadow: '$shadow1',
  backgroundColor: '$toastifyBackground',
  color: '$text',
  '@media (prefers-reduced-motion: no-preference)': {
    animationDuration: '400ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    animationFillMode: 'forwards',
    willChange: 'transform, opacity',
    '&[data-state="open"]': {
      '&[data-side="top"]': { animationName: scaleUpAnimation },
      '&[data-side="right"]': { animationName: scaleUpAnimation },
      '&[data-side="bottom"]': { animationName: scaleUpAnimation },
      '&[data-side="left"]': { animationName: scaleUpAnimation },
    },
  },
});

const TooltipTrigger = styled(HoverCardPrimitive.Trigger, {
  lineHeight: '0',
  cursor: 'pointer',
  svg: {
    color: '$secondaryText',
  },
  '&:hover': {
    color: '$text',
  },
});

export const Tooltip = ({
  content,
  children,
  css,
}: {
  content: React.ReactNode;
  children?: React.ReactNode;
  css?: CSS;
}) => {
  const { isMobile } = useMobileDetect();
  const [modal, setModal] = useState(false);
  const closeModal = () => {
    setModal(false);
  };
  return (
    <>
      {isMobile ? (
        <div>
          <Link
            css={{ display: 'inline-flex', alignItems: 'center' }}
            color="neutral"
            onClick={() => setModal(true)}
          >
            {children}
          </Link>
          <Modal open={modal} onOpenChange={closeModal} css={{ p: '$xl $md' }}>
            <Flex column alignItems="start" css={{ gap: '$md' }}>
              {content}
            </Flex>
          </Modal>
        </div>
      ) : (
        <>
          <HoverCardPrimitive.Root closeDelay={50} openDelay={0}>
            <TooltipTrigger css={css}>{children}</TooltipTrigger>
            <HoverCardPrimitive.Portal>
              <HoverCardContent>{content}</HoverCardContent>
            </HoverCardPrimitive.Portal>
          </HoverCardPrimitive.Root>
        </>
      )}
    </>
  );
};
