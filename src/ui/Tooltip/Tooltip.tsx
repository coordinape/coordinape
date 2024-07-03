import { useState } from 'react';

import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { CSS, keyframes, styled } from 'stitches.config';

import useMobileDetect from 'hooks/useMobileDetect';
import { Flex, Link, Modal } from 'ui';

const fadeIn = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const HoverCardContent = styled(HoverCardPrimitive.Content, {
  borderRadius: '$2',
  padding: '$sm',
  fontSize: '$small',
  '*': {
    lineHeight: '$shorter',
  },
  fontWeight: '$normal',
  maxWidth: 300,
  boxShadow: '$shadow1',
  backgroundColor: '$toastifyBackground',
  color: '$text',
  '@media (prefers-reduced-motion: no-preference)': {
    animationDuration: '400ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    animationFillMode: 'forwards',
    willChange: 'transform, opacity',
    '&[data-state="open"]': {
      '&[data-side="top"]': { animationName: fadeIn },
      '&[data-side="right"]': { animationName: fadeIn },
      '&[data-side="bottom"]': { animationName: fadeIn },
      '&[data-side="left"]': { animationName: fadeIn },
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

interface TooltipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
  css?: CSS;
  contentCss?: CSS;
  sideOffset?: number;
  contentProps?: HoverCardPrimitive.HoverCardContentProps;
}

export const Tooltip = ({
  content,
  children,
  css,
  contentCss,
  sideOffset = 5,
  contentProps,
}: TooltipProps) => {
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
        <HoverCardPrimitive.Root closeDelay={50} openDelay={0}>
          <TooltipTrigger css={css}>{children}</TooltipTrigger>
          <HoverCardPrimitive.Portal>
            <HoverCardContent
              sideOffset={sideOffset}
              {...contentProps}
              css={{ ...contentCss }}
            >
              {content}
            </HoverCardContent>
          </HoverCardPrimitive.Portal>
        </HoverCardPrimitive.Root>
      )}
    </>
  );
};
