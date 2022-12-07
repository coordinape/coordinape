import { useEffect, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { loginSupportedChainIds } from 'common-lib/constants';

import { IN_DEVELOPMENT } from 'config/env';
import { useApeSnackbar } from 'hooks';
import { Check, ChevronDown, ChevronUp } from 'icons/__generated';
import {
  Text,
  Flex,
  HR,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Box,
  Button,
} from 'ui';
import { Network } from 'ui/Network/Network';
import { switchNetwork } from 'utils/provider';

const NetworkButton = ({
  chainId,
  selectedChain,
  onError,
}: {
  chainId: number;
  selectedChain: number;
  onError: (error: Error | any) => void;
}) => {
  return (
    <Button
      fullWidth
      color="transparent"
      css={{
        '&:hover': { 'background-color': '$surface' },
        transition: 'background-color 200ms ease 0s',
      }}
      onClick={() => switchNetwork(chainId.toString(), onError)}
    >
      <Network key={chainId} chainId={chainId}>
        <Text>
          {loginSupportedChainIds[chainId]}
          {selectedChain == chainId && <Check size="lg" css={{ pl: '$sm' }} />}
        </Text>
      </Network>
    </Button>
  );
};

export const NetworkSelector = () => {
  const [selectedChain, setSelectedChain] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const UNSUPPORTED = -1;

  const { showInfo } = useApeSnackbar();
  const injectedWallet = !!(window as any).ethereum;
  const popoverWidth = 'calc($xl * 7)';

  const onNetworkError = (error: Error | any) => {
    if (error?.message.match(/Unrecognized chain ID .*/)) {
      showInfo(
        `Failed to switch networks. Unrecognized chain ID. Try adding the chain first.`
      );
    } else {
      throw new Error(error);
    }
  };

  const updateChain = async (provider: Web3Provider) => {
    const chainId = (await provider.getNetwork()).chainId;
    if (supportedChains.find(obj => +obj.value == chainId)) {
      setSelectedChain(chainId);
    } else {
      setSelectedChain(UNSUPPORTED);
    }
  };

  const supportedChains = Object.entries(loginSupportedChainIds).map(key => {
    return { value: key[0], label: key[1] };
  });

  const prodChains = [1, 10, 137, 250, 1313161554];
  const testnetChains = [5, ...(IN_DEVELOPMENT ? [1338] : [])];

  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (ethereum) {
      const provider = new Web3Provider(ethereum, 'any');
      updateChain(provider);

      provider.on('network', (_, oldNetwork) => {
        // When a Provider makes its initial connection, it emits a "network"
        // event with a null oldNetwork along with the newNetwork. So, if the
        // oldNetwork exists, it represents a changing network
        if (oldNetwork) {
          updateChain(provider);
        }
      });
    }
  }, []);

  const chainName = loginSupportedChainIds[selectedChain] || 'Unknown Chain';

  return (
    <Popover
      defaultOpen={false}
      onOpenChange={(open: boolean) => {
        setIsOpen(open);
      }}
    >
      <Flex
        css={{
          justifyContent: 'center',
        }}
      >
        <PopoverTrigger tabIndex={0} asChild={true}>
          <Button
            disabled={!injectedWallet}
            // as="div"
            color="surface"
            css={{
              width: popoverWidth,
            }}
          >
            <Network chainId={selectedChain}>
              {chainName}
              {isOpen ? <ChevronUp size="lg" /> : <ChevronDown size="lg" />}
            </Network>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          css={{
            mt: '$sm',
            width: popoverWidth,
            p: '$sm',
          }}
        >
          <Box>
            {prodChains.map(chainId => {
              return (
                <NetworkButton
                  key={chainId}
                  chainId={chainId}
                  selectedChain={selectedChain}
                  onError={onNetworkError}
                />
              );
            })}
            <HR sm />
            {testnetChains.map(chainId => {
              return (
                <NetworkButton
                  key={chainId}
                  chainId={chainId}
                  selectedChain={selectedChain}
                  onError={onNetworkError}
                />
              );
            })}
          </Box>
        </PopoverContent>
      </Flex>
    </Popover>
  );
};
