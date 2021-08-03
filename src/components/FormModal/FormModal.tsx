import React from 'react';

import clsx from 'clsx';

import { Button, Modal, makeStyles, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { SaveIcon } from 'icons';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    color: theme.colors.mediumGray,
    top: 0,
    right: 0,
    position: 'absolute',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 8,
    padding: theme.spacing(0, 8, 3),
    overflowY: 'auto',
    maxHeight: '100vh',
  },
  large: {
    maxWidth: 1140,
  },
  medium: {
    maxWidth: 820,
  },
  small: {
    maxWidth: 648,
  },
  title: {
    margin: theme.spacing(3, 0, 2),
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1.2,
    color: theme.colors.text,
    textAlign: 'center',
  },
  saveButton: {
    marginTop: theme.spacing(3),
  },
}));

export const FormModal = ({
  title,
  children,
  onSubmit,
  submitText,
  submitDisabled,
  className,
  visible,
  onClose,
  size,
}: {
  title?: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitText?: string;
  submitDisabled: boolean;
  className?: string;
  visible: boolean;
  onClose: () => void;
  size?: 'large' | 'medium' | 'small';
}) => {
  const classes = useStyles();

  return (
    <Modal className={classes.modal} onClose={onClose} open={visible}>
      <form
        className={clsx([classes[size ?? 'medium']], classes.body, className)}
        onSubmit={onSubmit}
      >
        <IconButton
          className={classes.closeButton}
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        {title ? <h3 className={classes.title}>{title}</h3> : undefined}
        {children}
        {onSubmit ? (
          <Button
            className={classes.saveButton}
            variant="contained"
            color="primary"
            size="small"
            startIcon={submitText ? undefined : <SaveIcon />}
            onClick={onSubmit}
            disabled={submitDisabled}
          >
            {submitText ? submitText : 'Save'}
          </Button>
        ) : undefined}
      </form>
    </Modal>
  );
};

export default FormModal;
