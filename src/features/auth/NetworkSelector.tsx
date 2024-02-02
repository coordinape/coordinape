import { useEffect, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { loginSupportedChainIds } from 'common-lib/constants';

import { Network } from 'components';
import { IN_DEVELOPMENT } from 'config/env';
import { useToast } from 'hooks';
import { ChevronDown, ChevronUp } from 'icons/__generated';
import {
  Flex,
  HR,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Box,
  Button,
} from 'ui';
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
  const current = selectedChain == chainId;
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
        <Flex
          // This flex pushes the icon to the right
          css={{
            flexGrow: 1,
          }}
        />
        {current && (
          <Flex
            css={{
              mr: '$sm',
              borderRadius: 999,
              backgroundColor: '$complete',
              width: '7px',
              height: '7px',
            }}
          ></Flex>
        )}
      </Network>
    </Button>
  );
};

export const NetworkSelector = () => {
  const [selectedChain, setSelectedChain] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const UNSUPPORTED = -1;

  const { showError } = useToast();
  const injectedWallet = !!(window as any).ethereum;

  const onNetworkError = (error: Error | any) => {
    if (error?.message.match(/Unrecognized chain ID .*/)) {
      showError(
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

  const chainOrder = [
    [1, 10, 137, 250, 1313161554],
    [5, ...(IN_DEVELOPMENT ? [420, 1338] : [])],
  ];

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
            color="secondary"
            size="medium"
            css={{
              borderColor: '$surface',
            }}
          >
            <Box css={{ mx: '$xs' }}>
              <Network chainId={selectedChain}>
                <Flex
                  // This flex pushes Chevron icon to the right
                  css={{
                    flexGrow: 1,
                  }}
                />
                {isOpen ? <ChevronUp size="lg" /> : <ChevronDown size="lg" />}
              </Network>
            </Box>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          css={{
            background: '$dim',
            mt: '$sm',
            py: '$sm',
          }}
          align="start"
        >
          <Box css={{ mx: '$xs' }}>
            {chainOrder.map((chainGroup, idx) => {
              return (
                <Box key={idx}>
                  {idx > 0 && <HR sm />}
                  {chainGroup.map(chainId => {
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
              );
            })}
          </Box>
        </PopoverContent>
      </Flex>
    </Popover>
  );
};
