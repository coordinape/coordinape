import React from 'react';

import {
  CircularProgress,
  Grid,
  Modal,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { useWallet } from 'hooks/useWallet';
import { ConnectorNames } from 'utils/enums';

import { ConnectWalletButtonItem } from './ConnectWalletButtonItem';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    outline: 'none',
    backgroundColor: theme.colors.white,
    minWidth: 700,
    maxWidth: 700,
    borderRadius: theme.spacing(1),
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(5.5),
    paddingRight: theme.spacing(5.5),
    userSelect: `none`,
    [theme.breakpoints.down('sm')]: {
      minWidth: 350,
      maxWidth: 350,
    },
  },
  header: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    color: theme.colors.primary,
    fontSize: 25,
    fontWeight: 700,
  },
  closeButton: {
    padding: theme.spacing(0.5),
    color: theme.colors.primary,
  },
  helper: {
    marginTop: theme.spacing(3),
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 600,
  },
  loader: {
    textAlign: 'center',
  },
}));

export const ConnectWalletModal = ({
  onClose,
  visible,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const classes = useStyles();
  const { activate, connectorName } = useWallet();

  const isMetamaskEnabled = 'ethereum' in window || 'web3' in window;

  const isConnectingToWallet = !!connectorName;

  const connectingToMetamask = connectorName === ConnectorNames.Injected;
  const connectingToWalletConnect =
    connectorName === ConnectorNames.WalletConnect;

  let connectingText = `Connecting to wallet`;
  if (connectingToMetamask) {
    connectingText = 'Waiting for Approval on Metamask';
  }
  if (connectingToWalletConnect) {
    connectingText = 'Opening QR for Wallet Connect';
  }

  return (
    <Modal
      className={classes.modal}
      disableBackdropClick={isConnectingToWallet}
      onClose={onClose}
      open={visible}
    >
      <div className={classes.content}>
        <div className={classes.header}>
          <Typography className={classes.title} component="h3">
            Connect Your Wallet
          </Typography>
          {/* <IconButton className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton> */}
        </div>

        {isConnectingToWallet ? (
          <div className={classes.loader}>
            <CircularProgress />
            <Typography>{connectingText}</Typography>
          </div>
        ) : (
          <div>
            <Grid container spacing={1}>
              <Grid item md={6} xs={12}>
                <ConnectWalletButtonItem
                  disabled={!isMetamaskEnabled}
                  icon={ConnectorNames.Injected}
                  onClick={() => {
                    activate(ConnectorNames.Injected);
                  }}
                  text="Metamask"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <ConnectWalletButtonItem
                  disabled={isConnectingToWallet}
                  icon={ConnectorNames.WalletConnect}
                  onClick={() => {
                    activate(ConnectorNames.WalletConnect);
                  }}
                  text="Wallet Connect"
                />
              </Grid>
            </Grid>
          </div>
        )}
        <Typography className={classes.helper}>
          New to Ethereum?{' '}
          <a href="https://ethereum.org">Learn more about wallets</a>
        </Typography>
      </div>
    </Modal>
  );
};
