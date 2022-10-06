import { useState, useEffect } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

import {
  CircularProgress,
  Modal,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { Box, Button, Text } from '../ui';
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
}

const useStyles = makeStyles(() => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export const WalletAuthModal = ({ open }: { open: boolean }) => {
  const classes = useStyles();
  const [connectMessage, setConnectMessage] = useState<string>('');

  const { showError, showInfo } = useApeSnackbar();
  const web3Context = useWeb3React<Web3Provider>();
  const walletAuth = useWalletAuth();

  const [isMetamaskEnabled, setIsMetamaskEnabled] = useState<boolean>(false);

  useEffect(() => {
    // safe to refer to window here because we are client side -g
    setIsMetamaskEnabled('ethereum' in window || 'web3' in window);
  }, []);

  const isConnecting = !!connectMessage;

  const activate = async (connectorName: EConnectorNames) => {
    const newConnector = connectors[connectorName];

    setConnectMessage(
      connectorName === EConnectorNames.Injected
        ? 'Waiting for Approval on Metamask'
        : connectorName === EConnectorNames.WalletConnect
        ? 'Opening QR for Wallet Connect'
        : connectorName === EConnectorNames.WalletLink
        ? 'Opening QR for Coinbase Wallet'
        : 'Connecting to wallet'
    );

    // Reset WalletConnect before reactivate
    // https://github.com/NoahZinsmeister/web3-react/issues/124
    if (newConnector instanceof WalletConnectConnector) {
      newConnector.walletConnectProvider = undefined;
    }

    try {
      await web3Context.activate(newConnector, () => {}, true);

      // workaround to disable listening for a deprecated event that sends the
      // wrong network ID
      // https://github.com/NoahZinsmeister/web3-react/issues/257#issuecomment-904070725
      const ethereum = (window as any).ethereum;
      if (ethereum?.isMetaMask)
        await ethereum?.removeAllListeners(['networkChanged']);
    } catch (error: any) {
      if (error.message.match(/Unsupported chain id/)) {
        showInfo('Switch to mainnet to continue.');
      } else if (
        [/rejected the request/, /User denied account authorization/].some(r =>
          error.message.match(r)
        )
      ) {
        // do nothing
      } else {
        showError(error);
        web3Context.deactivate();
      }
    }

    setConnectMessage('');
  };

  useEffect(() => {
    if (
      // safe to refer to window here because we are in useEffect -g
      window.location.search === AUTO_OPEN_WALLET_DIALOG_PARAMS ||
      walletAuth.connectorName
    ) {
      walletAuth.connectorName && activate(walletAuth.connectorName);
    }
  }, []);

  return (
    <Modal
      className={classes.modal}
      disableBackdropClick={isConnecting}
      open={open}
    >
      <Box
        css={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          outline: 'none',
          backgroundColor: '$white',
          borderRadius: '$3',
          padding: '$xl',
          userSelect: `none`,
          width: '$full',
          maxWidth: '500px',
        }}
      >
        <Text
          as="h3"
          css={{
            my: '$lg',
            color: '$text',
            fontSize: '25px',
            fontWeight: '$bold',
          }}
        >
          Connect Your Wallet
        </Text>
        {isConnecting ? (
          <Box
            css={{
              textAlign: 'center',
            }}
          >
            <CircularProgress />
            <Typography>{connectMessage}</Typography>
          </Box>
        ) : (
          <Box
            css={{
              display: 'grid',
              gridTemplateColumns: 'auto auto',
              width: '$full',
              gap: '$sm',
              '@xs': {
                gridTemplateColumns: 'auto',
              },
            }}
          >
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

            <Button
              variant="wallet"
              fullWidth
              onClick={() => {
                activate(EConnectorNames.WalletLink);
              }}
            >
              Coinbase Wallet
              <WALLET_ICONS.walletlink />
            </Button>
          </Box>
        )}
        <Text
          css={{
            display: 'inline',
            fontSize: '$small',
            marginTop: '$lg',
            textAlign: 'center',
            fontWeight: '$semibold',
          }}
        >
          New to Ethereum?{' '}
          <a href="https://ethereum.org">Learn more about wallets</a>
        </Text>
      </Box>
    </Modal>
  );
};
