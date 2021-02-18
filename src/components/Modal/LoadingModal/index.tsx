import {
  CircularProgress,
  Modal,
  Typography,
  makeStyles,
} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    outline: 'none',
    backgroundColor: theme.colors.secondary,
    width: 350,
    maxWidth: 350,
    padding: theme.spacing(4),
    userSelect: `none`,
    boxShadow: '0px 4px 44px rgba(0, 0, 0, 0.25)',
    backgroundImage: 'url(/svgs/whiteX_bg.svg)',
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: 'right',
    backgroundPositionY: 'bottom',
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    lineHeight: '22px',
    color: theme.colors.third,
    textAlign: 'center',
    marginTop: 16,
  },
  indicator: { color: theme.colors.third },
}));

interface IProps {
  visible: boolean;
  onClose: () => void;
  text: string;
}

export const LoadingModal = (props: IProps) => {
  const classes = useStyles();
  const { onClose, text, visible } = props;

  return (
    <Modal
      className={classes.modal}
      disableBackdropClick
      onClose={onClose}
      open={visible}
    >
      <div className={classes.content}>
        <CircularProgress className={classes.indicator} size={40} />
        {text && (
          <Typography className={classes.title} component="div">
            {text}
          </Typography>
        )}
      </div>
    </Modal>
  );
};
