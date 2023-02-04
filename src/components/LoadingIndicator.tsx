import { keyframes } from '../stitches.config';
import { Box, Text } from '../ui';

const defaultSize = 32;

const rotation = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

const animloader = keyframes({
  '50%': { transform: 'scale(1) translate(-50%, -50%);' },
});

export const LoadingIndicator = ({
  size,
  text,
}: {
  size?: number;
  text?: string;
}) => {
  if (!size) {
    size = defaultSize;
  }

  return (
    <Box
      css={{
        outline: 'none',
        userSelect: `none`,
        textAlign: 'center',
      }}
      data-note={`loading-${text || ''}`}
      data-testid={`loading-${text || ''}`}
      role="progressbar"
    >
      <Box
        css={{
          width: size + 'px',
          height: size + 'px',
          margin: '15px auto',
          position: 'relative',
          color: '#FFF',
          boxSizing: 'border-box',
          animation: `${rotation} 1s linear infinite`,
          '&::after, &::before': {
            content: '',
            boxSizing: 'border-box',
            position: 'absolute',
            width: size / 2 + 'px',
            height: size / 2 + 'px',
            top: '50%',
            left: '50%',
            transform: 'scale(0.5) translate(0, 0)',
            backgroundColor: '$cta',
            borderRadius: '50%',
            animation: `${animloader} 1s infinite ease-in-out`,
          },
          '&::before': {
            backgroundColor: '#fff',
            transform: `scale(0.5) translate(-${size}px, -${size}px)`,
          },
        }}
      ></Box>
      {text && <Text>{text}</Text>}
    </Box>
  );
};
