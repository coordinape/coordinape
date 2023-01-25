import { Modal, makeStyles } from '@material-ui/core';

import { keyframes } from '../stitches.config';
import { Box, Text } from '../ui';

const useStyles = makeStyles(() => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const rotation = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

const animloader = keyframes({
  '50%': { transform: 'scale(1) translate(-50%, -50%);' },
});

export const LoadingModal = (props: {
  visible: boolean;
  onClose?: () => void;
  text?: string;
  note?: string;
}) => {
  const classes = useStyles();
  const { onClose, text, visible } = props;

  return (
    <Modal
      className={classes.modal}
      disableBackdropClick
      onClose={onClose}
      open={visible}
    >
      <Box
        css={{
          outline: 'none',
          padding: '$sm',
          userSelect: `none`,
          textAlign: 'center',
        }}
        data-note={`loading-${props.note || ''}`}
        data-testid={`loading-${props.note || ''}`}
      >
        <Box
          css={{
            width: '96px',
            height: '96px',
            margin: '15px auto',
            position: 'relative',
            color: '#FFF',
            boxSizing: 'border-box',
            animation: `${rotation} 1s linear infinite`,
            '&::after, &::before': {
              content: '',
              boxSizing: 'border-box',
              position: 'absolute',
              width: '48px',
              height: '48px',
              top: '50%',
              left: '50%',
              transform: 'scale(0.5) translate(0, 0)',
              backgroundColor: '#FFF',
              borderRadius: '50%',
              animation: `${animloader} 1s infinite ease-in-out`,
            },
            '&::before': {
              backgroundColor: '$cta',
              transform: 'scale(0.5) translate(-96px, -96px)',
            },
          }}
        ></Box>
        {text && <Text>{text}</Text>}
      </Box>
    </Modal>
  );
};
