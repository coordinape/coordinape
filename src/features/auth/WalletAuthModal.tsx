import { useEffect, useRef, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { loginSupportedChainIds } from 'common-lib/constants';

import { CircularProgress } from '@material-ui/core';

import { EConnectorNames, WALLET_ICONS } from 'config/constants';
import isFeatureEnabled from 'config/features';
import { useToast } from 'hooks';
import { useWeb3React } from 'hooks/useWeb3React';
import { Mail } from 'icons/__generated';
import { Box, Button, Text, Modal, Flex, HR, Link } from 'ui';

import { connectors } from './connectors';
import { getMagicProvider } from './magic';
import { NetworkSelector } from './NetworkSelector';

const UNSUPPORTED = 'unsupported';

export const WalletAuthModal = () => {
  const [connectMessage, setConnectMessage] = useState<string>('');
  const [selectedChain, setSelectedChain] = useState<string>('1');

  const { showError, showDefault } = useToast();
  const web3Context = useWeb3React<Web3Provider>();
  const [isMetamaskEnabled, setIsMetamaskEnabled] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(true);
  const [explainerOpen, setExplainerOpen] = useState(false);

  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const unsupportedNetwork = selectedChain == UNSUPPORTED;

  const updateChain = async (provider: Web3Provider) => {
    const chainId = (await provider.getNetwork()).chainId.toString();

    // Only update state if component is still mounted
    if (mounted.current) {
      if (loginSupportedChainIds[chainId]) {
        setSelectedChain(chainId);
      } else {
        setSelectedChain(UNSUPPORTED);
      }
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
        showDefault('Switch to a supported network to continue.');
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

  const showExplainer = () => {
    setModalOpen(false);
    setExplainerOpen(true);
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

  if (explainerOpen)
    return (
      <Explainer
        back={() => {
          setExplainerOpen(false);
          setModalOpen(true);
        }}
        continue={() => {
          setExplainerOpen(false);
          inject();
        }}
      />
    );

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
            Welcome to Coordinape
          </Text>
          <Text semibold css={{ justifyContent: 'center', width: '100%' }}>
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
                  gap: '$md',
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
                  <Button variant="wallet" fullWidth onClick={showExplainer}>
                    Email
                    <Mail />
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
            <Link inlineLink href="https://ethereum.org">
              Learn more about wallets
            </Link>
          </Text>
        </Flex>
      </Flex>
    </Modal>
  );
};

const Explainer = (props: { back: () => void; continue: () => void }) => {
  return (
    <Modal>
      <Text h3 semibold>
        How Email Login Works
      </Text>
      <p>
        Because this is a Web3 application, it relies on an Ethereum (or EVM)
        wallet. When you log in with email, we will create a wallet for you,
        using a service called <a href="https://magic.link/">magic.link</a>.
      </p>
      <p>
        After entering your email address, you will see a &quot;Signature
        Request&quot;. This lets our system know that you control your new
        wallet and its address, to finish logging in.
      </p>
      <p>
        With this wallet, you can receive tokens from Coordinape CoVaults, and
        interact with the blockchain in other ways.
      </p>
      <p>
        For more information on wallets, web3, and best practices, please read{' '}
        <a href="https://docs.coordinape.com/info/documentation/email-login-and-web3-best-practices">
          here
        </a>
        .
      </p>
      <Flex gap="sm" css={{ justifyContent: 'flex-end' }}>
        <Button color="secondary" onClick={props.back}>
          Cancel
        </Button>
        <Button onClick={props.continue}>Continue</Button>
      </Flex>
    </Modal>
  );
};
