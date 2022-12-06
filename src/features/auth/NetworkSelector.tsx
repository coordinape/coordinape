/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactComponentElement, useRef, useState } from 'react';

import type { Web3Provider } from '@ethersproject/providers';
import { loginSupportedChainIds } from 'common-lib/constants';
import { number } from 'zod';

import { IN_DEVELOPMENT } from 'config/env';
import { useApeSnackbar } from 'hooks';
import {
  AuroraLogo,
  CeloLogo,
  ChevronDown,
  ChevronUp,
  EthColorLogo,
  EthLogo,
  FantomLogo,
  GanacheLogo,
  OptimismLogo,
  PolygonMaticLogo,
} from 'icons/__generated';
import {
  Avatar,
  Text,
  Flex,
  HR,
  Popover,
  PopoverArrow,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  POPOVER_TIMEOUT,
  Box,
  IconButton,
  Button,
  Link,
} from 'ui';
import { switchNetwork } from 'utils/provider';

export const NetworkSelector = () => {
  const [selectedChain, setSelectedChain] = useState<string>('1');
  const { showInfo } = useApeSnackbar();
  const UNSUPPORTED = 'unsupported';
  const unsupportedNetwork = selectedChain == UNSUPPORTED;

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

  const supportedChains = Object.entries(loginSupportedChainIds).map(key => {
    return { value: key[0], label: key[1] };
  });

  const prodChains = [1, 10, 137, 250, 1313161554];
  const testnetChains = [5, ...(IN_DEVELOPMENT ? [1338] : [])];

  const onNetworkError = (error: Error | any) => {
    if (error?.message.match(/Unrecognized chain ID .*/)) {
      showInfo(`Unrecognized chain ID. Try adding the chain first.`);
    } else {
      throw new Error(error);
    }
  };

  // eslint-disable-next-line no-console
  console.log({ supportedChains, loginSupportedChainIds, testnetChains });
  const [mouseEnterPopover, setMouseEnterPopover] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);
  let timeoutId: ReturnType<typeof setTimeout>;

  return (
    <Popover open={mouseEnterPopover}>
      <Box>
        <PopoverTrigger
          tabIndex={0}
          css={{
            borderRadius: '$pill',
            mr: '$xs',
          }}
          ref={triggerRef}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              setMouseEnterPopover(true);
            }
          }}
          onMouseDown={() => {
            clearTimeout(timeoutId);
            setMouseEnterPopover(true);
          }}
          onMouseEnter={() => {
            clearTimeout(timeoutId);
            setMouseEnterPopover(true);
          }}
          onMouseLeave={() => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(
              () => setMouseEnterPopover(false),
              POPOVER_TIMEOUT
            );
          }}
        >
          <Text>
            Select Network
            {mouseEnterPopover ? (
              <ChevronUp size="lg" />
            ) : (
              <ChevronDown size="lg" />
            )}
          </Text>
        </PopoverTrigger>
        <PopoverContent
          onKeyDown={e => {
            if (e.key === 'Escape') {
              setMouseEnterPopover(false);
            }
          }}
          onMouseEnter={() => {
            clearTimeout(timeoutId);
            setMouseEnterPopover(true);
          }}
          onMouseLeave={() => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(
              () => setMouseEnterPopover(false),
              POPOVER_TIMEOUT
            );
          }}
          css={{
            // outline: 'none',
            position: 'relative',
            left: '55px',
            // 1px border position bugfix:
            // pl: '1px',
            top: 'calc($xxs + 1px)',
            // mb: '$lg',
            minWidth: 'calc($4xl * 2.5)',
            zIndex: 4,
          }}
        >
          <Box
            css={{
              display: 'flex',
              flexDirection: 'column',
              p: '$md',
            }}
          >
            {prodChains.map(chainId => {
              return <Network key={chainId} chainId={chainId} />;
            })}
            <HR noMargin />
            {testnetChains.map(chainId => {
              return <Network key={chainId} chainId={chainId} />;
            })}
          </Box>
        </PopoverContent>
      </Box>
    </Popover>
  );
};

const Network = ({ chainId }: { chainId: number }) => {
  const chainLogos: Record<number, any> = {
    1: <EthLogo nostroke />,
    5: <EthColorLogo nostroke />,
    10: <OptimismLogo nostroke />,
    137: <PolygonMaticLogo nostroke />,
    1338: <GanacheLogo nostroke />,
    250: <FantomLogo nostroke />,
    1313161554: <AuroraLogo nostroke />,
  };
  return (
    <Flex key={chainId} css={{ width: '220px' }}>
      <Button
        fullWidth
        color="transparent"
        css={{
          justifyContent: 'flex-start',
          transition: 'background-color 250ms ease 0s',
          '&:hover': { 'background-color': '$surface' },
        }}
        onClick={() => switchNetwork(chainId.toString())}
      >
        {chainLogos[chainId]}
        <Text css={{ pl: '$xs' }}>{loginSupportedChainIds[chainId]}</Text>
      </Button>
    </Flex>
  );
};
