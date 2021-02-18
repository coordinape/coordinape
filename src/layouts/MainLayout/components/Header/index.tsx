import { makeStyles } from '@material-ui/core';
import { AccountInfo, ConnectWalletButton } from 'components';
import { STORAGE_KEY_CONNECTOR } from 'config/constants';
import { useConnectedWeb3Context, useGlobal } from 'contexts';
import { transparentize } from 'polished';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.custom.appHeaderHeight,
    display: 'flex',
    justifyContent: 'space-between',
    padding: `0 ${theme.spacing(4)}px`,
    alignItems: 'center',
    boxShadow: `0px 1px 2px ${transparentize(0.9, theme.colors.black)}`,
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    [theme.breakpoints.down('xs')]: {
      padding: `0 ${theme.spacing(2)}px`,
    },
  },
  img: {
    height: Number(theme.custom.appHeaderHeight) / 2,
  },
}));

interface IProps {
  className?: string;
}

export const Header = (props: IProps) => {
  const classes = useStyles();
  const { account, rawWeb3Context } = useConnectedWeb3Context();
  const { toggleWalletConnectModal } = useGlobal();
  const connector = localStorage.getItem(STORAGE_KEY_CONNECTOR);

  const onDisconnect = () => {
    rawWeb3Context.deactivate();
    localStorage.removeItem(STORAGE_KEY_CONNECTOR);
  };

  return (
    <div className={classes.root}>
      <img
        alt="logo"
        className={classes.img}
        src="/svgs/logo/coordinape_logo.svg"
      />
      {!account ? (
        <ConnectWalletButton onClick={toggleWalletConnectModal} />
      ) : (
        <AccountInfo
          address={account}
          icon={connector || ''}
          onDisconnect={onDisconnect}
        />
      )}
    </div>
  );
};
