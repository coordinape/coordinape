import { keyframes } from 'stitches.config';

export const slideInRight = keyframes({
  from: { right: '-100vw' },
  to: { right: 0 },
});
export const slideOutRight = keyframes({
  from: { right: 0 },
  to: { right: '-100vw' },
});
export const slideDown = keyframes({
  from: {
    height: 0,
  },
  to: {
    height: 'var(--radix-collapsible-content-height)',
  },
});
export const slideUp = keyframes({
  from: {
    height: 'var(--radix-collapsible-content-height)',
  },
  to: {
    height: 0,
  },
});
export const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});
export const fadeOut = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});
export const rotate = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});
export const sync = keyframes({
  '0%': {
    scale: 1,
    opacity: 0,
  },
  '30%': {
    opacity: 1,
    rotate: '1deg',
  },
  '100%': {
    scale: 0.05,
    opacity: 1,
    rotate: '-20deg',
  },
});
