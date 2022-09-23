import { keyframes } from 'stitches.config';

export const slideInRight = keyframes({
  from: { right: '-100vw' },
  to: { right: 0 },
});
export const slideOutRight = keyframes({
  from: { right: 0 },
  to: { right: '-100vw' },
});

export const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});
export const fadeOut = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});
