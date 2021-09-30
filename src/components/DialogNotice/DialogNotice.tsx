import React from 'react';

import {
  Button,
  Modal,
  makeStyles,
  IconButton,
  DialogContent,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    color: theme.colors.white,
    opacity: 0.5,
    top: 0,
    right: 0,
    position: 'absolute',
  },
  body: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.colors.text,
    color: `#ffffff80`,
    width: '100%',
    maxWidth: 757,
    borderRadius: 8,
    padding: theme.spacing(5, 8),
    overflowY: 'auto',
    maxHeight: '100vh',
    fontSize: 18,
    lineHeight: 1.4,
    fontWeight: 400,
    textAlign: 'center',
    '&:focus-visible': {
      outline: 'none',
    },
  },
  title: {
    margin: theme.spacing(0, 0, 5),
    fontSize: 24,
    fontWeight: 600,
    lineHeight: 1.3,
    color: theme.colors.white,
    textAlign: 'center',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    margin: theme.spacing(5, 0, 1),
  },
}));

export const DialogNotice = ({
  open,
  title,
  children,
  onClose,
  onPrimary,
  onSecondary,
  primaryText,
  secondaryText,
}: {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  onPrimary?: () => void;
  onSecondary?: () => void;
  primaryText?: string;
  secondaryText?: string;
}) => {
  const classes = useStyles();

  return (
    <Modal className={classes.modal} onClose={onClose} open={open}>
      <DialogContent className={classes.body}>
        {onClose && (
          <IconButton
            className={classes.closeButton}
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        )}
        {title && <h3 className={classes.title}>{title}</h3>}
        {children}
        {(onPrimary || onSecondary) && (
          <div className={classes.actions}>
            {onSecondary && (
              <Button
                disableElevation
                variant="contained"
                size="small"
                onClick={onSecondary}
              >
                {secondaryText ?? 'Okay, Got it'}
              </Button>
            )}
            {onPrimary && (
              <Button
                disableElevation
                variant="contained"
                size="small"
                color="primary"
                onClick={onPrimary}
              >
                {primaryText ?? 'Okay, Got it'}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Modal>
  );
};
