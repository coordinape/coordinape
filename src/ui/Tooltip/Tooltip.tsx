import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { CSS, keyframes, styled } from 'stitches.config';

const scaleUpAnimation = keyframes({
  '0%': { opacity: 0, transform: 'scale(0)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});

/** **NOTE**: The hover card is intended for mouse users only. */
const HoverCardContent = styled(HoverCardPrimitive.Content, {
  borderRadius: 8,
  padding: '$sm',
  fontSize: '16px',
  lineHeight: '$base',
  fontWeight: '$normal',
  maxWidth: 240,
  boxShadow: '0px 4px 6px rgba(181, 193, 199, 0.16)',
  backgroundColor: 'gainsboro',
  color: '$text',
  background:
    'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), linear-gradient(0deg, #FFFFFF, #FFFFFF)',
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
  lineHeight: '$none',
  '&:hover': {
    color: 'Black',
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
  return (
    <HoverCardPrimitive.Root closeDelay={50} openDelay={0}>
      <TooltipTrigger css={css}>{children}</TooltipTrigger>
      <HoverCardContent>{content}</HoverCardContent>
    </HoverCardPrimitive.Root>
  );
};
