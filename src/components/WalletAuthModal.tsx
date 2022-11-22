import { useState, useEffect } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { loginSupportedChainIds } from 'common-lib/constants';
import { concat } from 'lodash';

import {
  CircularProgress,
  Modal,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { Box, Button, Text, Flex, HR, Select } from '../ui';
import { EConnectorNames, WALLET_ICONS } from 'config/constants';
import { useApeSnackbar } from 'hooks';
import { useWalletAuth } from 'recoilState/app';
import { connectors } from 'utils/connectors';
import { AUTO_OPEN_WALLET_DIALOG_PARAMS } from 'utils/domain';
import { switchNetwork } from 'utils/provider';

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

  const [defaultChain, setDefaultChain] = useState<string>('1');

  const { showError, showInfo } = useApeSnackbar();
  const web3Context = useWeb3React<Web3Provider>();
  const walletAuth = useWalletAuth();

  const [isMetamaskEnabled, setIsMetamaskEnabled] = useState<boolean>(false);

  const UNSUPPORTED = 'unsupported';
  const UnsupportedNetwork = defaultChain == UNSUPPORTED;
  const supportedChains = Object.entries(loginSupportedChainIds).map(key => {
    return { value: key[0], label: key[1], disabled: false };
  });

  const loginOptions = concat(supportedChains, [
    { value: UNSUPPORTED, label: '-', disabled: true },
  ]);

  const getInitialChain = async (ethereum: any) => {
    if (ethereum) {
      updateChain(await new Web3Provider(ethereum).send('eth_chainId', []));
    }
  };

  const updateChain = (chainIdHex: string) => {
    // convert hex chainId to decimal
    const chainId = parseInt(chainIdHex, 16).toString();

    if (supportedChains.find(obj => obj.value == chainId)) {
      setDefaultChain(chainId);
    } else {
      setDefaultChain(UNSUPPORTED);
    }
  };

  const onNetworkError = (error: Error | any) => {
    if (error?.message.match(/Unrecognized chain ID .*/)) {
      showInfo(`Unrecognized chain ID. Try adding the chain first.`);
    } else {
      throw new Error(error);
    }
  };

  useEffect(() => {
    // safe to refer to window here because we are client side -g
    const metamaskEnabled = 'ethereum' in window || 'web3' in window;
    setIsMetamaskEnabled(metamaskEnabled);

    const ethereum = (window as any).ethereum;
    getInitialChain(ethereum);

    if (ethereum) {
      // The "any" network will allow spontaneous network changes
      const provider = new Web3Provider(ethereum, 'any');
      provider.on('network', (_, oldNetwork) => {
        // When a Provider makes its initial connection, it emits a "network"
        // event with a null oldNetwork along with the newNetwork. So, if the
        // oldNetwork exists, it represents a changing network
        if (oldNetwork) {
          window.location.reload();
        }
      });
    }
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
    } catch (error: any) {
      if (error.message.match(/Unsupported chain id/)) {
        showInfo('Switch to a supported network to continue.');
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
      <Flex
        column
        alignItems="start"
        css={{
          gap: '$lg',
          outline: 'none',
          backgroundColor: '$white',
          borderRadius: '$3',
          padding: '$xl',
          width: '$full',
          maxWidth: '500px',
        }}
      >
        <Flex column css={{ gap: '$md' }}>
          <Text h3 semibold>
            Select Network
          </Text>
          <Select
            value={defaultChain}
            options={loginOptions}
            onValueChange={v => switchNetwork(v, onNetworkError)}
            css={{
              minWidth: '50%',
            }}
          />
          {UnsupportedNetwork && (
            <Text variant="formError">Please choose a supported network</Text>
          )}
        </Flex>
        <HR noMargin />
        <Flex alignItems="start" column css={{ gap: '$md', width: '$full' }}>
          <Text h3 semibold>
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
                disabled={!isMetamaskEnabled || UnsupportedNetwork}
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
              textAlign: 'center',
              fontWeight: '$semibold',
            }}
          >
            New to Ethereum?{' '}
            <a href="https://ethereum.org">Learn more about wallets</a>
          </Text>
        </Flex>
      </Flex>
    </Modal>
  );
};
