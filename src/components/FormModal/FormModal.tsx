import React from 'react';

import clsx from 'clsx';

import { Button, Modal, makeStyles } from '@material-ui/core';

import { SaveIcon } from 'icons';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  submitDisabled,
  className,
  visible,
  onClose,
  size,
}: {
  title?: string;
  children: React.ReactNode;
  onSubmit?: () => void;
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
        {title ? <h3 className={classes.title}>{title}</h3> : undefined}
        {children}
        {onSubmit ? (
          <Button
            className={classes.saveButton}
            variant="contained"
            color="primary"
            size="small"
            startIcon={<SaveIcon />}
            onClick={onSubmit}
            disabled={submitDisabled}
          >
            Save
          </Button>
        ) : undefined}
      </form>
    </Modal>
  );
};

export default FormModal;
