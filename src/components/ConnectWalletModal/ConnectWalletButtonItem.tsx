import React from 'react';

import clsx from 'clsx';

import { Button, makeStyles } from '@material-ui/core';

import { WALLET_ICONS } from 'config/constants';
import { ConnectorNames } from 'utils/enums';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0.2, 0),
    padding: theme.spacing(1.5, 2.2),
    color: theme.colors.text,
    backgroundColor: theme.colors.transparent,
    border: 'solid',
    borderWidth: 2,
    boxShadow: '0px 4px 6px rgba(181, 193, 199, 0.3)',
    '& svg': {
      height: theme.spacing(3),
      width: theme.spacing(3),
    },
    '&:hover': {
      color: theme.colors.selected,
      background: theme.colors.third,
    },
  },
  label: {
    fontSize: 15,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

interface IProps {
  className?: string;
  onClick: () => void;
  disabled?: boolean;
  text: string;
  icon: ConnectorNames;
}

export const ConnectWalletButtonItem = (props: IProps) => {
  const classes = useStyles();
  const { disabled = false, icon, onClick, text } = props;
  const Icon: React.ElementType = WALLET_ICONS[icon];
  return (
    <Button
      className={clsx(classes.root, props.className)}
      classes={{ label: classes.label }}
      disabled={disabled}
      fullWidth
      onClick={onClick}
    >
      {text}
      <Icon />
    </Button>
  );
};
