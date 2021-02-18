import { Button, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: 14,
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
