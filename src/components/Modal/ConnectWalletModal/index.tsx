import {
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Modal,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { ConnectWalletButtonItem } from 'components';
import { STORAGE_KEY_CONNECTOR } from 'config/constants';
import React, { useEffect } from 'react';
import connectors from 'utils/connectors';
import { ConnectorNames } from 'utils/enums';
import { getLogger } from 'utils/logger';

const logger = getLogger('ConnectWalletModal::Index');

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    outline: 'none',
    backgroundColor: theme.colors.third,
    minWidth: 700,
    maxWidth: 700,
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(2)}px`,
    userSelect: `none`,
    [theme.breakpoints.down('sm')]: {
      minWidth: 350,
      maxWidth: 350,
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
  },
  title: {
    color: theme.colors.primary,
    fontSize: theme.spacing(3),
  },
  closeButton: {
    padding: theme.spacing(0.5),
    color: theme.colors.primary,
  },
  bottom: {
    padding: `0 ${theme.spacing(2)}px`,
    textAlign: 'center',
    '& > * + *': { marginTop: theme.spacing(1.5) },
  },
  helper: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
  loader: {
    textAlign: 'center',
  },
}));

interface IProps {
  visible: boolean;
  onClose: () => void;
}

export const ConnectWalletModal = (props: IProps) => {
  const classes = useStyles();
  const context = useWeb3React();
  const { onClose, visible } = props;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>();

  useEffect(() => {
    if (activatingConnector && activatingConnector === context.connector) {
      setActivatingConnector(undefined);
      onClose();
    }
    // eslint-disable-next-line
  }, [activatingConnector, context.connector]);

  if (context.error) {
    localStorage.removeItem(STORAGE_KEY_CONNECTOR);
    context.deactivate();
    onClose();
    logger.error('Error in web3 context', context.error);
  }

  const isMetamaskEnabled = 'ethereum' in window || 'web3' in window;

  const onClickWallet = (wallet: ConnectorNames) => {
    const currentConnector = connectors[wallet];
    if (wallet === ConnectorNames.Injected) {
      setActivatingConnector(currentConnector);
    }
    if (wallet === ConnectorNames.WalletConnect) {
      setActivatingConnector(currentConnector);
    }

    if (wallet) {
      if (
        currentConnector instanceof WalletConnectConnector &&
        currentConnector.walletConnectProvider?.wc?.uri
      ) {
        currentConnector.walletConnectProvider = undefined;
      }
      context.activate(currentConnector);
      localStorage.setItem(STORAGE_KEY_CONNECTOR, wallet);
    }
  };

  const isConnectingToWallet = !!activatingConnector;
  let connectingText = `Connecting to wallet`;
  const connectingToMetamask = activatingConnector === connectors.injected;
  const connectingToWalletConnect =
    activatingConnector === connectors.walletconnect;
  if (connectingToMetamask) {
    connectingText = 'Waiting for Approval on Metamask';
  }
  if (connectingToWalletConnect) {
    connectingText = 'Opening QR for Wallet Connect';
  }

  const disableMetamask: boolean = !isMetamaskEnabled || false;

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
            Sign In
          </Typography>
          <IconButton className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
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
                  disabled={disableMetamask}
                  icon={ConnectorNames.Injected}
                  onClick={() => {
                    onClickWallet(ConnectorNames.Injected);
                  }}
                  text="Metamask"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <ConnectWalletButtonItem
                  disabled={isConnectingToWallet}
                  icon={ConnectorNames.WalletConnect}
                  onClick={() => {
                    onClickWallet(ConnectorNames.WalletConnect);
                  }}
                  text="Wallet Connect"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <ConnectWalletButtonItem
                  disabled={isConnectingToWallet}
                  icon={ConnectorNames.WalletLink}
                  onClick={() => {
                    onClickWallet(ConnectorNames.WalletLink);
                  }}
                  text="Coinbase Wallet"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <ConnectWalletButtonItem
                  disabled={isConnectingToWallet}
                  icon={ConnectorNames.Fortmatic}
                  onClick={() => {
                    onClickWallet(ConnectorNames.Fortmatic);
                  }}
                  text="Fortmatic"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <ConnectWalletButtonItem
                  disabled={isConnectingToWallet}
                  icon={ConnectorNames.Portis}
                  onClick={() => {
                    onClickWallet(ConnectorNames.Portis);
                  }}
                  text="Portis"
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
