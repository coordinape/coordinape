import { Button, makeStyles } from '@material-ui/core';
import { AccountInfo, ConnectWalletButton, ReceiveInfo } from 'components';
import { STORAGE_KEY_CONNECTOR } from 'config/constants';
import { useConnectedWeb3Context, useGlobal, useUserInfo } from 'contexts';
import { transparentize } from 'polished';
import React, { useEffect, useState } from 'react';
import { getApiService } from 'services/api';
import { IUser, Maybe } from 'types';

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.custom.appHeaderHeight,
    display: 'flex',
    justifyContent: 'space-between',
    padding: `0 ${theme.spacing(6)}px`,
    alignItems: 'center',
    background: theme.colors.primary,
    boxShadow: `0px 1px 2px ${transparentize(0.9, theme.colors.black)}`,
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    [theme.breakpoints.down('xs')]: {
      padding: `0 ${theme.spacing(2)}px`,
    },
    zIndex: 1,
  },
  img: {
    height: 58,
    marginTop: 6,
  },
  buttons: {
    marginTop: 14,
  },
  info: {
    display: 'flex',
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
  const { me } = useUserInfo();

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
      <div className={classes.buttons}>
        {!account ? (
          <ConnectWalletButton onClick={toggleWalletConnectModal} />
        ) : (
          <div className={classes.info}>
            {me ? <ReceiveInfo /> : ''}
            <AccountInfo
              address={account}
              icon={connector || ''}
              onDisconnect={onDisconnect}
            />
          </div>
        )}
      </div>
    </div>
  );
};
