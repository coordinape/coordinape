import React from 'react';

import { transparentize } from 'polished';

import { Button, Modal, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: theme.spacing(4),
    outline: 'none',
    backgroundColor: theme.colors.text,
    width: 757,
    maxWidth: 757,
    borderRadius: 8,
    userSelect: `none`,
    boxShadow: '0px 4px 44px rgba(0, 0, 0, 0.25)',
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: 'right',
    backgroundPositionY: 'bottom',
    textAlign: 'center',
    position: 'relative',
  },
  title: {
    marginTop: theme.spacing(1.5),
    fontSize: 24,
    fontWeight: 600,
    lineHeight: '30.62px',
    color: theme.colors.white,
    textAlign: 'center',
  },
  description: {
    marginTop: theme.spacing(5),
    padding: theme.spacing(0, 2),
    fontSize: 18,
    fontWeight: 400,
    lineHeight: '25px',
    color: transparentize(0.7, theme.colors.white),
    textAlign: 'center',
  },
  button: {
    marginTop: theme.spacing(5),
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: theme.spacing(1.5, 3),
    fontSize: 16,
    lineHeight: '23.7px',
    textTransform: 'none',
    color: theme.colors.white,
    alignItems: 'center',
    background: theme.colors.red,
    borderRadius: 24,
    filter: 'drop-shadow(2px 3px 6px rgba(81, 99, 105, 0.33))',
    '&:hover': {
      background: theme.colors.red,
      filter: 'drop-shadow(2px 3px 6px rgba(81, 99, 105, 0.5))',
    },
  },
  closeButton: {
    marginTop: theme.spacing(0.4),
    position: 'absolute',
    right: 0,
    top: 0,
    fontSize: 18,
    fontWeight: 'bold',
    color: transparentize(0.7, theme.colors.background),
    '&:hover': {
      background: 'none',
    },
  },
}));

interface IProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  button: string;
}

export const PopUpModal = (props: IProps) => {
  const classes = useStyles();
  const { onClose, title, description, button, visible } = props;

  return (
    <Modal className={classes.modal} onClose={onClose} open={visible}>
      <div className={classes.content}>
        <Button
          className={classes.closeButton}
          disableRipple={true}
          onClick={onClose}
        >
          𝖷
        </Button>
        {title && (
          <Typography className={classes.title} component="div">
            {title}
          </Typography>
        )}
        {description && (
          <Typography className={classes.description} component="div">
            {description}
          </Typography>
        )}
        {button && (
          <Button className={classes.button} onClick={onClose}>
            {button}
          </Button>
        )}
      </div>
    </Modal>
  );
};
