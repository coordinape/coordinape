import { CSS } from 'stitches.config';

import { keyframes } from '../stitches.config';
import { Box } from '../ui';

const pusher = keyframes({
  '0%': {
    transform: 'translate3d(-100%,0,0)',
  },
  '100%': {
    transform: 'translate3d(250%,0,0)',
  },
});

export const LoadingBar = ({ css }: { css?: CSS }) => {
  return (
    <Box
      css={{
        background: '$contentHeaderBorder',
        height: '1px',
        margin: '0 auto',
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        '&::before, &::after': {
          content: '',
          background: '$cta',
          display: 'block',
          height: '1px',
          left: 0,
          position: 'absolute',
          top: 0,
          transform: 'translate3d(-100%,0,0)',
          width: '50%',
        },
        '&::before': {
          animation: `${pusher} 2s infinite`,
        },
        '&::after': {
          animation: `${pusher} 2s -1s infinite`,
        },
        ...css,
      }}
    />
  );
};
