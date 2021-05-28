import React from 'react';

import clsx from 'clsx';

import { Button, Hidden, makeStyles } from '@material-ui/core';

import { WALLET_ICONS } from 'config/constants';
import { ConnectorNames } from 'utils/enums';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '0 14px',
    height: 32,
    fontSize: 12,
    fontWeight: 600,
    color: theme.colors.text,
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), #FFFFFF',
    borderRadius: 8,
    textTransform: 'none',
  },
  iconWrapper: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    marginRight: 8,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& svg': {
      width: theme.spacing(2),
      height: theme.spacing(2),
    },
  },
}));

interface IProps {
  className?: string;
  onClick?: () => void;
}

export const ConnectWalletButton = (props: IProps) => {
  const classes = useStyles();
  const Icon = WALLET_ICONS[ConnectorNames.Injected];

  return (
    <Button
      className={clsx(classes.root, props.className)}
      onClick={props.onClick}
      variant="text"
    >
      <Hidden smDown>
        <div className={classes.iconWrapper}>
          <Icon />
        </div>
      </Hidden>
      Connect your wallet
    </Button>
  );
};
