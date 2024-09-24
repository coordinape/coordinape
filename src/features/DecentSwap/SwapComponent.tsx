import { useEffect, useState, Fragment, useMemo, useCallback } from 'react';

import { ChainId, TokenInfo } from '@decent.xyz/box-common';
import { useBoxAction, UseBoxActionArgs } from '@decent.xyz/box-hooks';
import { DropDownIcon, TokenSelector } from '@decent.xyz/box-ui';
import { useBalance } from 'features/DecentSwap/useBalance';
import { Address } from 'viem';
import { Connector, useAccount } from 'wagmi';

import { LoadingBar } from 'components/LoadingBar';
import { LoadingIndicator } from 'components/LoadingIndicator';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { EthLogo, OptimismLogo } from 'icons/__generated';
import { Button, Flex, Link, Panel, Text, TextField } from 'ui';

import { ChainSelectorModal } from './ChainSelectorModal';
import { chainInfo, getDefaultToken, ethL2GasToken } from './constants';
import { confirmRoute, executeTransaction } from './executeTransaction';
import useDebounced from './useDebounced';
import { useAmtInQuote, useAmtOutQuote } from './useSwapQuotes';

export type RouteVars = {
  srcChain: ChainId;
  srcToken: TokenInfo;
  dstChain: ChainId;
  dstToken: TokenInfo;
  purchaseName: string;
};

const roundValue = (value: any, decimals: number) => {
  const num = typeof value === 'number' ? value : parseFloat(value);

  if (isNaN(num)) {
    return value;
  }

  const factor = Math.pow(10, decimals);
  const rounded = Math.round((num + Number.EPSILON) * factor) / factor;

  return String(rounded);
};

export const SwapComponent = () => {
  const { chainId, connector } = useAccount();

  const address = useConnectedAddress();
  if (!chainId || !address) {
    return <LoadingIndicator />;
  }
  return (
    <DisplayModal
      connectedAddress={address as Address}
      chain={chainId}
      connector={connector}
    ></DisplayModal>
  );
};
function DisplayModal({
  connectedAddress,
  chain,
  connector,
}: {
  connectedAddress: Address;
  chain: ChainId;
  connector?: Connector;
}) {
  const [routeVars, setRouteVars] = useState<RouteVars>({
    srcChain: ChainId.BASE,
    srcToken: ethL2GasToken(ChainId.BASE),
    dstChain: ChainId.OPTIMISM,
    dstToken: ethL2GasToken(ChainId.OPTIMISM),
    purchaseName: '',
  });
  const { dstToken, srcToken, srcChain } = routeVars;
  const setSrcChain = (c: ChainId) =>
    setRouteVars(prevState => ({ ...prevState, srcChain: c }));
  const setSrcToken = (t: TokenInfo) =>
    setRouteVars(prevState => ({ ...prevState, srcToken: t }));

  const [showContinue, setShowContinue] = useState(true);

  const { tokenBalance: srcTokenBalance } = useBalance(
    connectedAddress,
    srcToken
  );
  const srcTokenBalanceRounded = roundValue(srcTokenBalance, 3) ?? 0;

  const [submitting, setSubmitting] = useState(false);
  const [showChainSelectorModal, setShowChainSelectorModal] = useState(false);
  const [submitErrorText, setSubmitErrorText] = useState('');
  const [boxActionArgs, setBoxActionArgs] = useState<
    UseBoxActionArgs | undefined
  >();
  const { actionResponse } = useBoxAction(
    boxActionArgs ?? ({ enable: false } as UseBoxActionArgs)
  );
  const handleSrcAmtChange = useCallback((strVal: string) => {
    if (strVal == '') {
      setSrcInputVal('');
      return;
    }

    if (!/^\d*\.?\d*$/.test(strVal)) return;
    setSrcInputVal(strVal);
    setDstInputVal(null);
    overrideDebouncedDst(null);
    setSubmitErrorText('');
  }, []);

  const handleDstAmtChange = useCallback((strVal: string) => {
    if (!/^\d*\.?\d*$/.test(strVal)) return;
    setDstInputVal(strVal);
    setSrcInputVal(null);
    overrideDebouncedSrc(null);
  }, []);

  const [srcInputVal, setSrcInputVal] = useState<string | null>(null);
  const [dstInputVal, setDstInputVal] = useState<string | null>(null);

  const [srcInputDebounced, overrideDebouncedSrc] = useDebounced(srcInputVal);
  const [dstInputDebounced, overrideDebouncedDst] = useDebounced(dstInputVal);

  const srcDebounceWaiting = srcInputDebounced != srcInputVal;
  const dstDebounceWaiting = dstInputDebounced != dstInputVal;

  const {
    isLoading: amtOutLoading,
    errorText: amtOutErrorText,
    fees: amtOutFees,
    srcCalcedVal,
  } = useAmtOutQuote(
    dstInputDebounced,
    dstToken,
    srcToken,
    srcChain,
    connectedAddress
  );

  const {
    isLoading: amtInLoading,
    errorText: amtInErrorText,
    fees: amtInFees,
    dstCalcedVal,
  } = useAmtInQuote(
    srcInputDebounced,
    dstToken,
    srcToken,
    srcChain,
    connectedAddress
  );

  const srcDisplay = useMemo(
    () => srcCalcedVal ?? srcInputVal ?? '',
    [srcCalcedVal, srcInputVal]
  );
  const dstDisplay = useMemo(
    () => dstCalcedVal ?? dstInputVal ?? '',
    [dstCalcedVal, dstInputVal]
  );
  useEffect(() => {
    const srcNum = Number(srcDisplay);
    if (srcNum > srcTokenBalance) {
      setSubmitErrorText(
        'Insufficient funds. Try onramping to fill your wallet.'
      );
    } else {
      setSubmitErrorText('');
    }
  }, [srcTokenBalance, srcDisplay]);

  const srcSpinning = amtOutLoading || dstDebounceWaiting;
  const dstSpinning = amtInLoading || srcDebounceWaiting;

  const continueDisabled =
    !!submitErrorText ||
    !!amtOutErrorText ||
    !!amtInErrorText ||
    !chain ||
    srcSpinning ||
    dstSpinning ||
    !(Number(srcInputDebounced) || Number(dstInputDebounced)) ||
    submitting;

  const confirmDisabled = !actionResponse?.tx;
  const SrcChainIcon = srcChain ? chainInfo[srcChain].icon : EthLogo;

  const decentBoxStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    img: {
      height: 16,
    },
  };

  if (!connectedAddress) {
    return <LoadingIndicator />;
  }

  return (
    <Flex column>
      <Text
        size="small"
        semibold
        inline
        css={{
          textAlign: 'center',
          borderTop: '0.5px solid $border',
          my: '$sm',
          pt: '$sm',
          pb: '$xs',
        }}
      >
        Bridge ETH using{' '}
        <Link
          inlineLink
          href="https://checkout.decent.xyz/?app=bridge"
          css={{ color: '$text', textDecoration: 'underline' }}
        >
          Decent.xyz
        </Link>
      </Text>
      <Panel
        css={{
          gap: '$sm',
          p: '$sm $md $sm',
        }}
      >
        <Flex
          css={{
            gap: '$sm',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            flexWrap: 'wrap',
            borderTop: '1px solid transparent',
            position: 'relative',
          }}
        >
          {(srcSpinning || dstSpinning) && (
            <LoadingBar css={{ position: 'absolute', left: 0, top: '-$sm' }} />
          )}
          <Flex column>
            <Flex
              column
              css={{ width: '100%', alignItems: 'flex-start', gap: '$xs' }}
            >
              <Text variant="label">Send</Text>
              <Flex css={{ alignItems: 'center', gap: '$md' }}>
                <TextField
                  type="text"
                  size="sm"
                  css={{ width: '100%' }}
                  value={srcDisplay}
                  onChange={e => handleSrcAmtChange(e.target.value)}
                  disabled={srcSpinning || submitting}
                />
              </Flex>

              <Flex
                css={{
                  alignItems: 'center',
                  gap: '$sm',
                  fontSize: '$small',
                  flexWrap: 'wrap',
                  '>span': {
                    display: 'flex',
                    gap: 3,
                  },
                  '.box-btn': {
                    background: 'transparent',
                    '.box-align-middle': {
                      ...decentBoxStyles,
                    },
                    ...decentBoxStyles,
                  },
                }}
              >
                <TokenSelector
                  disabled={false}
                  chainId={srcChain}
                  selectedToken={srcToken}
                  setSelectedToken={t => {
                    setSrcToken(t);
                    setShowContinue(true);
                  }}
                  address={connectedAddress}
                />
                <Flex
                  onClick={() => setShowChainSelectorModal(true)}
                  css={{
                    alignItems: 'center',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Text css={{ mr: '$xs' }}>From</Text>
                  {srcChain === 1 || srcChain === 11155111 ? (
                    <SrcChainIcon nostroke></SrcChainIcon>
                  ) : (
                    <SrcChainIcon nostroke fa></SrcChainIcon>
                  )}
                  <DropDownIcon></DropDownIcon>
                </Flex>
                {showChainSelectorModal && (
                  <ChainSelectorModal
                    onClose={() => setShowChainSelectorModal(false)}
                    chainId={srcChain}
                    onSelectChain={c => {
                      setSrcChain(c);
                      const t = getDefaultToken(c);
                      setSrcToken(t);
                      setShowContinue(true);
                    }}
                  ></ChainSelectorModal>
                )}
              </Flex>
              <Text size="small" color="secondary" inline>
                Balance:
                <Text inline css={{ whiteSpace: 'nowrap' }}>
                  {srcTokenBalanceRounded} {srcToken.symbol}
                </Text>
              </Text>
            </Flex>
          </Flex>
          <Flex column>
            <Flex column css={{ alignItems: 'flex-start', gap: '$xs' }}>
              <Text variant="label">Receive </Text>
              <TextField
                type="text"
                size="sm"
                css={{ width: '100%' }}
                value={dstDisplay}
                onChange={e => handleDstAmtChange(e.target.value)}
                disabled={dstSpinning || submitting}
              />
              <Flex
                css={{
                  alignItems: 'center',
                  gap: '$xs',
                  fontSize: '$small',
                  flexWrap: 'wrap',
                }}
              >
                <EthLogo nostroke />
                <Text inline>{dstToken.symbol}</Text>
                <Text>
                  on Optimism
                  <OptimismLogo nostroke css={{ ml: '$xs' }} />
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        {submitErrorText && (
          <Text
            tag
            size="small"
            color="warning"
            css={{ whiteSpace: 'normal', height: 'auto' }}
          >
            {submitErrorText}
          </Text>
        )}
        {showContinue ? (
          <Button
            css={{ mt: '$sm' }}
            onClick={() =>
              confirmRoute({
                chain: chain,
                srcChain,
                srcToken,
                dstToken,
                setBoxActionArgs,
                setRouteVars,
                srcInputVal: srcInputDebounced!,
                dstInputVal: dstInputDebounced!,
                connectedAddress,
                continueDisabled,
                setSubmitting,
                setShowContinue,
                srcDisplay,
                connector,
              })
            }
            disabled={continueDisabled}
          >
            Confirm Selection
          </Button>
        ) : (
          <Button
            disabled={confirmDisabled}
            onClick={() =>
              executeTransaction({
                actionResponse,
                setSubmitting,
                setShowContinue,
                connectedAddress,
                srcChain,
              })
            }
          >
            {submitting ? 'submitting..' : 'Bridge with Decent'}
          </Button>
        )}
        {!showContinue && (
          <Text size="small" color="warning">
            {routeVars.srcChain === ChainId.POLYGON
              ? 'Bridging from Polygon will take somewhere between 5-25 to complete.'
              : 'Bridging may take few minutes to complete. Please be patient.'}
          </Text>
        )}
        <Flex column css={{ gap: '$xs' }}>
          {srcInputDebounced &&
            amtInFees &&
            Object.keys(amtInFees).map(feeName => (
              <Fragment key={feeName}>
                <Text size="small" color="neutral">
                  {feeName}: {amtInFees[feeName]}
                </Text>
              </Fragment>
            ))}

          {dstInputDebounced &&
            amtOutFees &&
            Object.keys(amtOutFees).map(feeName => (
              <Fragment key={feeName}>
                <Text size="small" color="neutral">
                  {feeName}: {amtOutFees[feeName]}
                </Text>
              </Fragment>
            ))}
        </Flex>
      </Panel>
    </Flex>
  );
}
