import { Button, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '0 22px',
    height: 42,
    fontSize: 14,
    color: theme.colors.primary,
    background: '#EBEBEC',
    borderRadius: 21,
    borderColor: '#EDE9E9',
    borderWidth: 1,
    borderStyle: 'solid',
  },
}));

interface IProps {
  className?: string;
  onClick: () => void;
}

export const ConnectWalletButton = (props: IProps) => {
  const classes = useStyles();
  return (
    <Button
      className={clsx(classes.root, props.className)}
      onClick={() => {
        props.onClick();
      }}
      variant="text"
    >
      Connect Wallet
    </Button>
  );
};
