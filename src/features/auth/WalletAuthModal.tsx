import { useEffect, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { loginSupportedChainIds } from 'common-lib/constants';
import { concat } from 'lodash';

import { CircularProgress } from '@material-ui/core';

import { EConnectorNames, WALLET_ICONS } from 'config/constants';
import isFeatureEnabled from 'config/features';
import { useApeSnackbar } from 'hooks';
import { useWeb3React } from 'hooks/useWeb3React';
import { Box, Button, Text, Modal, Flex, HR, Select } from 'ui';
import { switchNetwork } from 'utils/provider';

import { connectors } from './connectors';
import { useWalletAuth } from './useWalletAuth';

export const WalletAuthModal = () => {
  const [connectMessage, setConnectMessage] = useState<string>('');

  const [selectedChain, setSelectedChain] = useState<string>('1');

  const { showError, showInfo } = useApeSnackbar();
  const web3Context = useWeb3React<Web3Provider>();
  const walletAuth = useWalletAuth();

  const [isMetamaskEnabled, setIsMetamaskEnabled] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(true);

  const isMultichainEnabled = isFeatureEnabled('multichain_login');

  const UNSUPPORTED = 'unsupported';
  const unsupportedNetwork = selectedChain == UNSUPPORTED;
  const supportedChains = Object.entries(loginSupportedChainIds).map(key => {
    return { value: key[0], label: key[1], disabled: false };
  });

  const loginOptions = concat(supportedChains, [
    { value: UNSUPPORTED, label: '-', disabled: true },
  ]);

  const updateChain = async (
    provider: Web3Provider,
    mounted: { active: boolean }
  ) => {
    const chainId = (await provider.getNetwork()).chainId.toString();

    // Only update state if component is still mounted
    if (mounted.active) {
      if (supportedChains.find(obj => obj.value == chainId)) {
        setSelectedChain(chainId);
      } else {
        setSelectedChain(UNSUPPORTED);
      }
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
    const mounted = { active: true };
    // safe to refer to window here because we are client side -g
    const ethereum = (window as any).ethereum;
    setIsMetamaskEnabled(!!ethereum);

    if (ethereum) {
      // The "any" network will allow spontaneous network changes

      const provider = new Web3Provider(ethereum, 'any');

      updateChain(provider, mounted);
      provider.on('network', (_, oldNetwork) => {
        // When a Provider makes its initial connection, it emits a "network"
        // event with a null oldNetwork along with the newNetwork. So, if the
        // oldNetwork exists, it represents a changing network
        if (oldNetwork) {
          window.location.reload();
        }
      });
    }

    return () => {
      mounted.active = false;
    };
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

    setConnectMessage('');
  };

  useEffect(() => {
    if (walletAuth.connectorName && !web3Context.active)
      activate(walletAuth.connectorName);
  }, []);

  const inject = async () => {
    // web3Context.setProvider(new Web3Provider((window as any).ethereum), 'other');

    try {
      // hide our modal because it interferes with typing into Magic's modal
      setModalOpen(false);
      alert('This button does nothing');
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
        {isMultichainEnabled && (
          <div>
            <Flex column css={{ gap: '$md' }}>
              <Text h3 semibold>
                Select Network
              </Text>
              <Select
                value={selectedChain}
                options={loginOptions}
                onValueChange={v => switchNetwork(v, onNetworkError)}
                css={{
                  minWidth: '50%',
                }}
              />
              {unsupportedNetwork && (
                <Text variant="formError">
                  Please choose a supported network
                </Text>
              )}
            </Flex>
            <HR noMargin />
          </div>
        )}
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
