import { useState, useEffect } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

import {
  CircularProgress,
  Modal,
  Grid,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { Button } from '../../ui';
import { WALLET_ICONS } from 'config/constants';
import { useApeSnackbar } from 'hooks';
import { useWalletAuth } from 'recoilState/app';
import { connectors } from 'utils/connectors';
import { AUTO_OPEN_WALLET_DIALOG_PARAMS } from 'utils/domain';

// TODO: why does this error?
// import { EConnectorNames } from 'types';
enum EConnectorNames {
  Injected = 'injected',
  WalletConnect = 'walletconnect',
  WalletLink = 'walletlink',
  Fortmatic = 'fortmatic',
  // Portis = 'portis',
}

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    outline: 'none',
    backgroundColor: theme.colors.white,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2, 5.5, 4),
    userSelect: `none`,
    width: '100%',
    maxWidth: 500,
  },
  title: {
    marginBottom: theme.spacing(3),
    color: theme.colors.primary,
    fontSize: 25,
    fontWeight: 700,
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
  button: {
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
    '& .MuiButton-label': {
      fontSize: 15,
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    '&.MuiButton-root.Mui-disabled': {
      color: theme.colors.text,
      opacity: 0.5,
    },
  },
}));

const WALLET_TIMEOUT = 1000 * 60; // 60 seconds

export const WalletAuthModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) => {
  const classes = useStyles();
  const [connectMessage, setConnectMessage] = useState<string>('');

  const { apeError } = useApeSnackbar();
  const web3Context = useWeb3React<Web3Provider>();
  const walletAuth = useWalletAuth();

  const isMetamaskEnabled = 'ethereum' in window || 'web3' in window;
  const isConnecting = !!connectMessage;

  const activate = async (connectorName: EConnectorNames) => {
    const newConnector = connectors[connectorName];

    setConnectMessage(
      connectorName === EConnectorNames.Injected
        ? 'Waiting for Approval on Metamask'
        : connectorName === EConnectorNames.WalletConnect
        ? 'Opening QR for Wallet Connect'
        : 'Connecting to wallet'
    );

    // Reset WalletConnect before reactivate
    // https://github.com/NoahZinsmeister/web3-react/issues/124
    if (
      newConnector instanceof WalletConnectConnector &&
      newConnector.walletConnectProvider?.wc?.uri
    ) {
      newConnector.walletConnectProvider = undefined;
    }

    const timeoutHandle = setTimeout(() => {
      apeError('Wallet activation timed out.');
      web3Context.deactivate();
    }, WALLET_TIMEOUT);

    await web3Context.activate(newConnector, (error: Error) => {
      apeError(error);
      console.error(error);
      web3Context.deactivate();
    });

    clearTimeout(timeoutHandle);

    setConnectMessage('');
    setOpen(false);
  };

  useEffect(() => {
    if (
      window.location.search === AUTO_OPEN_WALLET_DIALOG_PARAMS ||
      walletAuth.connectorName
    ) {
      setOpen(true);
      walletAuth.connectorName && activate(walletAuth.connectorName);
    }
  }, []);

  return (
    <Modal
      className={classes.modal}
      disableBackdropClick={isConnecting}
      onClose={() => setOpen(false)}
      open={open}
    >
      <div className={classes.content}>
        <h3 className={classes.title}>Connect Your Wallet</h3>

        {isConnecting ? (
          <div className={classes.loader}>
            <CircularProgress />
            <Typography>{connectMessage}</Typography>
          </div>
        ) : (
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <Button
                variant="wallet"
                disabled={!isMetamaskEnabled}
                fullWidth
                onClick={() => {
                  activate(EConnectorNames.Injected);
                }}
              >
                {isMetamaskEnabled ? 'Metamask' : 'Metamask Not Found'}
                <WALLET_ICONS.injected />
              </Button>
            </Grid>
            <Grid item md={6} xs={12}>
              <Button
                variant="wallet"
                fullWidth
                onClick={() => {
                  activate(EConnectorNames.WalletConnect);
                }}
              >
                Wallet Connect
                <WALLET_ICONS.walletconnect />
              </Button>
            </Grid>
          </Grid>
        )}
        <Typography className={classes.helper}>
          New to Ethereum?{' '}
          <a href="https://ethereum.org">Learn more about wallets</a>
        </Typography>
      </div>
    </Modal>
  );
};
