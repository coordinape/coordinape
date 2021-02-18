import { Button, makeStyles } from '@material-ui/core';
import { AccountInfo, ConnectWalletButton } from 'components';
import { STORAGE_KEY_CONNECTOR } from 'config/constants';
import { useConnectedWeb3Context, useGlobal } from 'contexts';
import { transparentize } from 'polished';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 272,
    background: '#F3F3F3',
    borderRadius: 16,
    padding: '15px 32px',
    textAlign: 'center',
  },
  balance: {
    fontSize: 40,
    color: '#555555',
    marginTop: 14,
    marginBottom: 0,
  },
  balanceNumber: {
    fontWeight: 600,
  },
  description: {
    fontSize: 13,
    color: '#555555',
    margin: 0,
  },
  saveButton: {
    background: '#31A5AC',
    color: '#FFFFFFb3',
    fontSize: 18,
    marginTop: 18,
  },
}));

interface IProps {
  className?: string;
}

export const Account = (props: IProps) => {
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
      {!account ? (
        <ConnectWalletButton onClick={toggleWalletConnectModal} />
      ) : (
        <div>
          <AccountInfo
            address={account}
            icon={connector || ''}
            onDisconnect={onDisconnect}
          />
          <p className={classes.balance}>
            <span className={classes.balanceNumber}>25</span> of{' '}
            <span className={classes.balanceNumber}>100</span>
          </p>
          <p className={classes.description}>Give Allocated</p>
          <Button className={classes.saveButton}>Save Allocations</Button>
        </div>
      )}
    </div>
  );
};
