import { makeStyles } from '@material-ui/core';
import { AccountInfo, ConnectWalletButton } from 'components';
import { STORAGE_KEY_CONNECTOR } from 'config/constants';
import { useConnectedWeb3Context, useGlobal } from 'contexts';
import { transparentize } from 'polished';
import React, { useEffect, useState } from 'react';
import { getApiService } from 'services/api';
import { IUser, Maybe } from 'types';

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
    zIndex: 1,
  },
  img: {
    height: Number(theme.custom.appHeaderHeight) / 2,
  },
  info: {
    display: 'flex',
  },
  myReceive: {
    marginRight: 5,
    padding: '0 18px',
    height: 42,
    fontSize: 12,
    color: '#555555',
    background: 'rgba(49, 165, 172, 0.2)',
    display: 'flex',
    alignItems: 'center',
    borderRadius: 21,
    borderColor: '#EDE9E9',
    borderWidth: 1,
    borderStyle: 'solid',
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
  const [me, setMe] = useState<Maybe<IUser>>(null);

  useEffect(() => {
    const getMe = async () => {
      if (account) {
        try {
          // Get Me
          const users = await getApiService().getUsers(account);
          setMe(users[0]);
        } catch {
          setMe(null);
        }
      } else {
        setMe(null);
      }
    };

    getMe();
  }, [account]);

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
        <div className={classes.info}>
          <div className={classes.myReceive}>
            {me?.give_token_received || 0} RECEIVE
          </div>
          <AccountInfo
            address={account}
            icon={connector || ''}
            onDisconnect={onDisconnect}
          />
        </div>
      )}
    </div>
  );
};
