/**
 *
 * DEPRECATED -- please use src/ui/Modal and react-hook-form instead.
 * see VaultsPage for an example of separating modal and form.
 *
 */

import React from 'react';

import clsx from 'clsx';

import { Modal, makeStyles, IconButton } from '@material-ui/core';

import { Close } from 'icons/__generated';
import { Button } from 'ui';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    color: theme.colors.secondaryText,
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
    maxWidth: '100%',
    display: 'block',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  subtitle: {
    margin: theme.spacing(0, 0, 2),
    fontSize: 16,
    fontWeight: 300,
    lineHeight: 1.2,
    color: theme.colors.text,
    textAlign: 'center',
  },
  errors: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    margin: 0,
    minHeight: 45,
    color: theme.colors.alert,
  },
}));

export const FormModal = ({
  title,
  subtitle,
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
  subtitle?: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  errors?: { [x: string]: string };
  submitText?: string;
  submitDisabled: boolean;
  className?: string;
  open?: boolean;
  onClose: () => void;
  size?: 'large' | 'medium' | 'small';
}) => {
  const classes = useStyles();

  return (
    <Modal
      className={classes.modal}
      onClose={onClose}
      open={open !== undefined ? open : true}
    >
      <form
        className={clsx([classes[size ?? 'medium']], classes.body, className)}
        onSubmit={onSubmit}
      >
        <IconButton
          className={classes.closeButton}
          onClick={onClose}
          aria-label="close"
        >
          <Close />
        </IconButton>
        {!!title && <h3 className={classes.title}>{title}</h3>}
        {!!subtitle && <h4 className={classes.subtitle}>{subtitle}</h4>}
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
            css={{ mt: '$lg', gap: '$xs' }}
            color="primary"
            size="medium"
            onClick={event => {
              event.preventDefault();
              onSubmit();
            }}
            disabled={submitDisabled}
          >
            {submitText || 'Save'}
          </Button>
        )}
      </form>
    </Modal>
  );
};

export default FormModal;
