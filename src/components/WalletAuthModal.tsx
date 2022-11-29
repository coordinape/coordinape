import { useState, useEffect } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { loginSupportedChainIds } from 'common-lib/constants';
import { concat } from 'lodash';

import { CircularProgress } from '@material-ui/core';

import { Box, Button, Text, Modal, Flex, HR, Select } from '../ui';
import { EConnectorNames, WALLET_ICONS } from 'config/constants';
import isFeatureEnabled from 'config/features';
import { useApeSnackbar } from 'hooks';
import { useWalletAuth } from 'recoilState/app';
import { connectors } from 'utils/connectors';
import { AUTO_OPEN_WALLET_DIALOG_PARAMS } from 'utils/domain';
import { switchNetwork } from 'utils/provider';

export const WalletAuthModal = ({ open }: { open: boolean }) => {
  const [connectMessage, setConnectMessage] = useState<string>('');

  const [selectedChain, setSelectedChain] = useState<string>('1');

  const { showError, showInfo } = useApeSnackbar();
  const web3Context = useWeb3React<Web3Provider>();
  const walletAuth = useWalletAuth();

  const [isMetamaskEnabled, setIsMetamaskEnabled] = useState<boolean>(false);

  const isMultichainEnabled = isFeatureEnabled('multichain_login');

  const UNSUPPORTED = 'unsupported';
  const unsupportedNetwork = selectedChain == UNSUPPORTED;
  const supportedChains = Object.entries(loginSupportedChainIds).map(key => {
    return { value: key[0], label: key[1], disabled: false };
  });

  const loginOptions = concat(supportedChains, [
    { value: UNSUPPORTED, label: '-', disabled: true },
  ]);

  const updateChain = async (provider: Web3Provider) => {
    const chainId = (await provider.getNetwork()).chainId.toString();
    if (supportedChains.find(obj => obj.value == chainId)) {
      setSelectedChain(chainId);
    } else {
      setSelectedChain(UNSUPPORTED);
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
    const ethereum = (window as any).ethereum;
    setIsMetamaskEnabled(!!ethereum);

    if (ethereum) {
      // The "any" network will allow spontaneous network changes

      const provider = new Web3Provider(ethereum, 'any');

      updateChain(provider);
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
      showClose={isConnecting}
      open={open}
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
