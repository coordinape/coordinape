import React from 'react';

import clsx from 'clsx';

import { Button, Modal, makeStyles, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { SaveIcon } from 'icons';

const useStyles = makeStyles(theme => ({
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
    position: 'relative',
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
    padding: theme.spacing(0, 12, 3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 6, 3),
    },
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
  errors: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    margin: 0,
    minHeight: 45,
    color: theme.colors.red,
  },
}));

export const FormModal = ({
  title,
  children,
  onSubmit,
  errors,
  submitText,
  submitDisabled,
  className,
  open,
  onClose,
  size,
}: {
  title?: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  errors?: { [x: string]: string };
  submitText?: string;
  submitDisabled: boolean;
  className?: string;
  open: boolean;
  onClose: () => void;
  size?: 'large' | 'medium' | 'small';
}) => {
  const classes = useStyles();

  return (
    <Modal className={classes.modal} onClose={onClose} open={open}>
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
        {!!title && <h3 className={classes.title}>{title}</h3>}
        {children}
        {errors !== undefined && (
          <div className={classes.errors}>
            {Object.values(errors).map((error, i) => (
              <div key={i}>{error}</div>
            ))}
          </div>
        )}
        {!!onSubmit && (
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
        )}
      </form>
    </Modal>
  );
};

export default FormModal;
