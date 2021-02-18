import { Button, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { WALLET_ICONS } from 'config/constants';
import React from 'react';
import { ConnectorNames } from 'utils/enums';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.transparent,
    '& svg': {
      height: theme.spacing(3),
      width: theme.spacing(3),
    },
  },
  label: {
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
      variant="contained"
    >
      {text}
      <Icon />
    </Button>
  );
};
