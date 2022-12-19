import { useEffect, useRef, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { loginSupportedChainIds } from 'common-lib/constants';

import { CircularProgress } from '@material-ui/core';

import { EConnectorNames, WALLET_ICONS } from 'config/constants';
import isFeatureEnabled from 'config/features';
import { useApeSnackbar } from 'hooks';
import { useWeb3React } from 'hooks/useWeb3React';
import { Box, Button, Text, Modal, Flex, HR } from 'ui';

import { connectors } from './connectors';
import { getMagicProvider } from './magic';
import { NetworkSelector } from './NetworkSelector';

export const WalletAuthModal = () => {
  const [connectMessage, setConnectMessage] = useState<string>('');

  const [selectedChain, setSelectedChain] = useState<string>('1');

  const { showError, showInfo } = useApeSnackbar();
  const web3Context = useWeb3React<Web3Provider>();

  const [isMetamaskEnabled, setIsMetamaskEnabled] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(true);

  const UNSUPPORTED = 'unsupported';
  const unsupportedNetwork = selectedChain == UNSUPPORTED;
  const supportedChains = Object.entries(loginSupportedChainIds).map(key => {
    return { value: key[0], label: key[1], disabled: false };
  });

  const mounted = useRef(false);

  const updateChain = async (provider: Web3Provider) => {
    const chainId = (await provider.getNetwork()).chainId.toString();

    // Only update state if component is still mounted
    if (mounted.current) {
      if (supportedChains.find(obj => obj.value == chainId)) {
        setSelectedChain(chainId);
      } else {
        setSelectedChain(UNSUPPORTED);
      }
    }
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    // safe to refer to window here because we are client side -g
    const ethereum = (window as any).ethereum;
    setIsMetamaskEnabled(!!ethereum);

    if (ethereum) {
      // The "any" network will allow spontaneous network changes

      const provider = new Web3Provider(ethereum, 'any');
      updateChain(provider);
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
      // after this succeeds, consumers of useWeb3React will re-run and
      // web3Context.active will be true
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

    if (mounted.current) setConnectMessage('');
  };

  const inject = async () => {
    try {
      // hide our modal because it interferes with typing into Magic's modal
      setModalOpen(false);
      const provider = await getMagicProvider();
      web3Context.setProvider(provider, 'magic');
    } catch (e) {
      showError(e);
    } finally {
      setModalOpen(true);
      setConnectMessage('');
    }
  };

  return (
    <Modal
      showClose={isConnecting}
      open={modalOpen}
      css={{
        maxWidth: '500px',
        padding: '$xl',
      }}
    >
      <Flex>
        <Flex alignItems="start" column css={{ gap: '$md', width: '$full' }}>
          <Text h3 semibold css={{ justifyContent: 'center', width: '100%' }}>
            Connect Your Wallet
          </Text>
          {unsupportedNetwork && (
            <Text variant="formError">Please use a supported network</Text>
          )}
          {isConnecting ? (
            <Flex row css={{ justifyContent: 'center', width: '100%' }}>
              <CircularProgress />
              <Text css={{ gap: '$sm', padding: '$sm' }}>{connectMessage}</Text>
            </Flex>
          ) : (
            <Box css={{ width: '$full' }}>
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
                  disabled={!isMetamaskEnabled || unsupportedNetwork}
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

                {isFeatureEnabled('email_login') && (
                  <Button variant="wallet" fullWidth onClick={inject}>
                    Email
                  </Button>
                )}
              </Box>
              <HR />
              <Flex column css={{ gap: '$md' }}>
                <NetworkSelector />
              </Flex>
            </Box>
          )}
          <Text
            css={{
              display: 'block',
              fontSize: '$small',
              textAlign: 'center',
              fontWeight: '$semibold',
              width: '100%',
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
