import { keyframes } from '../stitches.config';
import { Box, Text, Modal } from 'ui';

const rotation = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

const animloader = keyframes({
  '50%': { transform: 'scale(1) translate(-50%, -50%);' },
});

const loadingSize = 64;

export const LoadingModal = (props: {
  visible: boolean;
  onClose?: () => void;
  text?: string;
  note?: string;
}) => {
  const { onClose, text, visible } = props;

  return (
    <Modal loader open={visible} onOpenChange={onClose}>
      <Box
        css={{
          outline: 'none',
          userSelect: `none`,
          textAlign: 'center',
        }}
        data-note={`loading-${props.note || ''}`}
        data-testid={`loading-${props.note || ''}`}
        role="progressbar"
      >
        <Box
          css={{
            width: loadingSize + 'px',
            height: loadingSize + 'px',
            margin: '15px auto',
            position: 'relative',
            color: '#FFF',
            boxSizing: 'border-box',
            animation: `${rotation} 1s linear infinite`,
            '&::after, &::before': {
              content: '',
              boxSizing: 'border-box',
              position: 'absolute',
              width: loadingSize / 2 + 'px',
              height: loadingSize / 2 + 'px',
              top: '50%',
              left: '50%',
              transform: 'scale(0.5) translate(0, 0)',
              backgroundColor: '$cta',
              borderRadius: '50%',
              animation: `${animloader} 1s infinite ease-in-out`,
            },
            '&::before': {
              backgroundColor: '#fff',
              transform: `scale(0.5) translate(-${loadingSize}px, -${loadingSize}px)`,
            },
          }}
        ></Box>
        {text && <Text>{text}</Text>}
      </Box>
    </Modal>
  );
};
