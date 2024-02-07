import assert from 'assert';

import { ChainId } from '@decent.xyz/box-common';
import { getBalance } from '@wagmi/core';
import { ethers } from 'ethers';
import { getMagicProvider } from 'features/auth/magic';
import { useSavedAuth } from 'features/auth/useSavedAuth';
import {
  wagmiConfig,
  wagmiChain,
  defaultAvailableChains,
} from 'features/DecentSwap/config';
import { DecentSwap } from 'features/DecentSwap/DecentSwap';
import { useQuery } from 'react-query';
import { Address } from 'viem';

import { useToast } from '../../hooks';
import { useWeb3React } from '../../hooks/useWeb3React';
import { Button, Flex, Panel, Text } from '../../ui';
import { switchToCorrectChain } from '../web3/chainswitch';
import { BridgeButton } from 'components/BridgeButton';
import { OptimismBridgeButton } from 'components/OptimismBridgeButton';
import { OrBar } from 'components/OrBar';
import { IN_PREVIEW } from 'config/env';
import { isFeatureEnabled } from 'config/features';

import { chain } from './chains';
import { MintOrBurnButton } from './MintOrBurnButton';
import { useCoSoulContracts } from './useCoSoulContracts';

const MIN_BALANCE = ethers.utils.parseEther('0.004');

export const CoSoulButton = ({ onReveal }: { onReveal(): void }) => {
  const { library, chainId, account, setProvider } = useWeb3React();
  const { savedAuth } = useSavedAuth();
  const contracts = useCoSoulContracts();
  const { showError } = useToast();

  const { data: balance } = useQuery(
    ['balanceOf', account],
    async () => {
      if (account) {
        return await getBalance(wagmiConfig, {
          address: account as Address,
          chainId: wagmiChain.id,
        });
      }
    },
    {
      refetchInterval: 2000,
      enabled: !!account,
    }
  );

  const onCorrectChain = chainId === Number(chain.chainId);

  const safeSwitchToCorrectChain = async () => {
    try {
      if (savedAuth.connectorName == 'magic') {
        const provider = await getMagicProvider('optimism');
        await setProvider(provider, 'magic');
      } else {
        assert(library);
        await switchToCorrectChain(library);
      }
    } catch (e: any) {
      showError('Error Switching to ' + chain.chainName + ': ' + e.message);
    }
  };

  if ((balance?.value || 0) < MIN_BALANCE.toBigInt()) {
    return (
      <Flex column css={{ gap: '$sm' }}>
        <Text tag semibold color={'warning'}>
          Your balance is{' '}
          {ethers.utils.formatEther(balance?.value ?? 0).slice(0, 10)} ETH
        </Text>
        <Panel neutral>
          <Text inline size="small" css={{ textAlign: 'center' }}>
            Please deposit at least{' '}
            <Text inline semibold>
              0.05-0.1 ETH
            </Text>
            <br />
            to your Optimism wallet
          </Text>
          <Flex column css={{ mt: '$sm' }}>
            {defaultAvailableChains.includes(chainId as ChainId) &&
            (!IN_PREVIEW || (IN_PREVIEW && isFeatureEnabled('test_decent'))) ? (
              <BridgeButton>
                <>
                  <DecentSwap></DecentSwap>
                  <OrBar>OR</OrBar>
                  <OptimismBridgeButton />
                </>
              </BridgeButton>
            ) : (
              <OptimismBridgeButton />
            )}
          </Flex>
        </Panel>
      </Flex>
    );
  }

  if (chain && !onCorrectChain) {
    return (
      <Button color="cta" size="large" onClick={safeSwitchToCorrectChain}>
        Switch to {chain.chainName} to Mint
      </Button>
    );
  }

  if (!contracts || !account) {
    // FIXME: better loading state
    return <Text>Loading...</Text>;
  }

  return (
    <MintOrBurnButton
      contracts={contracts}
      address={account}
      onReveal={onReveal}
    />
  );
};
