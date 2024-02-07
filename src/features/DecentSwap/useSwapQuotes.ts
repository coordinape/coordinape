import assert from 'assert';

import { ChainId, TokenInfo } from '@decent.xyz/box-common';
import { UseBoxActionArgs, useBoxAction } from '@decent.xyz/box-hooks';
import { Address, formatUnits } from 'viem';

import { formatFees } from './formatFees';
import {
  generateDecentAmountInParams,
  generateDecentAmountOutParams,
} from './generateDecentParams';

type UseBoxActionReturn = ReturnType<typeof useBoxAction>;
export type BoxActionResponse = UseBoxActionReturn['actionResponse'];

export type DecentQuote = {
  actionResponse?: BoxActionResponse;
  isLoading?: boolean;
  error?: Error;
};

export function useAmtOutQuote(
  dstInput: string | null,
  destToken: TokenInfo,
  srcToken: TokenInfo,
  srcChain: ChainId,
  connectedAddress: Address
) {
  const { actionResponse, isLoading, error } = useDecentAmountOutQuote(
    destToken,
    connectedAddress,
    dstInput ?? undefined,
    srcToken
  );

  const appFee = actionResponse?.applicationFee?.amount || 0n;
  const bridgeFee = actionResponse?.bridgeFee?.amount || 0n;
  const fees = formatFees(appFee, bridgeFee, srcChain);
  const tx = actionResponse?.tx;
  const amountIn = actionResponse?.tokenPayment?.amount || undefined;

  const srcCalcedVal = amountIn
    ? parseFloat(formatUnits(amountIn, srcToken.decimals)).toPrecision(8)
    : undefined;

  return {
    isLoading,
    srcCalcedVal,
    fees,
    tx,
    errorText: error
      ? 'Could not find routes. Try a different token pair.'
      : '',
  };
}

export function useAmtInQuote(
  srcInput: string | null,
  destToken: TokenInfo,
  srcToken: TokenInfo,
  srcChain: ChainId,
  connectedAddress: Address
) {
  const { actionResponse, isLoading, error } = useDecentAmountInQuote(
    destToken,
    connectedAddress,
    srcInput ?? undefined,
    srcToken
  );

  const appFee = actionResponse?.applicationFee?.amount || 0n;
  const bridgeFee = actionResponse?.bridgeFee?.amount || 0n;
  const fees = formatFees(appFee, bridgeFee, srcChain);
  const tx = actionResponse?.tx;
  const amountOut = actionResponse?.amountOut?.amount || undefined;

  const dstCalcedVal = amountOut
    ? parseFloat(formatUnits(amountOut, destToken.decimals)).toPrecision(8)
    : undefined;

  return {
    isLoading,
    dstCalcedVal,
    fees,
    tx,
    errorText: error
      ? 'Could not find routes. Try a different token pair.'
      : '',
  };
}

function useDecentAmountOutQuote(
  dstToken: TokenInfo,
  connectedAddress: Address,
  dstAmount?: string,
  srcToken?: TokenInfo
): DecentQuote {
  let boxArgs = undefined;
  assert(srcToken);
  try {
    boxArgs = generateDecentAmountOutParams({
      dstToken,
      dstAmount,
      srcToken,
      connectedAddress: connectedAddress,
      toAddress: connectedAddress,
    });
  } catch (e) {
    console.error(e);
  }

  const quote = useDecentQuote(boxArgs);
  return { ...quote };
}

function useDecentAmountInQuote(
  dstToken: TokenInfo,
  connectedAddress: Address,
  srcAmount?: string,
  srcToken?: TokenInfo
): DecentQuote {
  let boxArgs = undefined;
  assert(srcToken);
  try {
    boxArgs = generateDecentAmountInParams({
      dstToken,
      srcAmount,
      srcToken,
      connectedAddress: connectedAddress,
      toAddress: connectedAddress,
    });
  } catch (e) {
    console.error(e);
  }
  const quote = useDecentQuote(boxArgs);
  return { ...quote };
}

const useDecentQuote = (boxActionArgs?: UseBoxActionArgs) => {
  const { actionResponse, isLoading, error } = useBoxAction(
    boxActionArgs ?? ({ enable: false } as UseBoxActionArgs)
  );

  return {
    actionResponse: actionResponse,
    isLoading: !!boxActionArgs && isLoading,
    error: error as Error,
  };
};
