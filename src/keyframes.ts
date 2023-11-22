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
    height: 'auto',
  },
});
export const slideUp = keyframes({
  from: {
    height: 'auto',
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

export const pulse = keyframes({
  '0%': {
    transform: 'scale(1, 0.9)',
    opacity: 0.12,
  },
  '100%': {
    transform: 'scale(2, 4)',
    opacity: 0,
  },
});

export const scaleBounce = keyframes({
  '0%': {
    transform: 'scale(1)',
  },
  '50%': {
    transform: 'scale(1.3)',
  },
  '100%': {
    transform: 'scale(1)',
  },
});

export const coSoulNodesCycle = keyframes({
  '0%': {
    transform: 'scale(0)',
  },
  '10%': {
    transform: 'scale(0.3)',
    opacity: '0',
  },
  '90%': {
    transform: 'scale(0.31)',
    opacity: '0',
  },
  '100%': {
    transform: 'scale(1)',
    opacity: '1',
  },
});

export const coSoulArtCycle = keyframes({
  '0%': {
    filter: 'blur(18px)',
    transform: 'rotate(0deg)',
  },
  '70%': {
    filter: 'blur(125px)',
    transform: 'rotate(145deg)',
  },
  '100%': {
    filter: 'none',
    transform: 'rotate(360deg)',
  },
});
export const coLinkcoSoulArtCycle = keyframes({
  '0%': {
    filter: 'blur(18px)',
    opacity: 0,
    transform: 'rotate(0deg)',
  },
  '70%': {
    filter: 'blur(125px)',
    transform: 'rotate(145deg)',
  },
  '100%': {
    filter: 'none',
    opacity: 1,
    transform: 'rotate(360deg)',
  },
});

export const zoomBackground = keyframes({
  '0%': {
    scale: '100%',
  },
  '100%': {
    scale: '115%',
  },
});
