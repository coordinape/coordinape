import { ActionType, TokenInfo } from '@decent.xyz/box-common';
import { UseBoxActionArgs } from '@decent.xyz/box-hooks';
import { parseUnits } from 'viem';

export const generateDecentAmountInParams = ({
  dstToken,
  srcAmount,
  srcToken,
  connectedAddress,
  toAddress,
}: {
  dstToken: TokenInfo;
  srcAmount?: string;
  srcToken: TokenInfo;
  connectedAddress?: string;
  toAddress?: string;
}): UseBoxActionArgs | undefined => {
  if (
    !srcAmount ||
    !Number(srcAmount) ||
    !connectedAddress ||
    !toAddress ||
    !dstToken
  ) {
    return;
  }
  return {
    actionType: ActionType.SwapAction,
    actionConfig: makeAmountInActionConfig(
      dstToken,
      toAddress,
      srcToken,
      srcAmount
    ),
    srcToken: srcToken.address,
    dstToken: dstToken.address,
    srcChainId: srcToken.chainId,
    slippage: 1,
    dstChainId: dstToken.chainId,
    sender: connectedAddress,
  };
};

export const generateDecentAmountOutParams = ({
  dstToken,
  dstAmount,
  srcToken,
  connectedAddress,
  toAddress,
}: {
  dstToken: TokenInfo;
  dstAmount?: string;
  srcToken: TokenInfo;
  connectedAddress?: string;
  toAddress?: string;
}): UseBoxActionArgs | undefined => {
  if (!dstAmount || !Number(dstAmount) || !connectedAddress || !toAddress) {
    return;
  }

  return {
    actionType: ActionType.SwapAction,
    actionConfig: makeAmountOutActionConfig(dstToken, toAddress, dstAmount),
    srcToken: srcToken.address,
    dstToken: dstToken.address,
    srcChainId: srcToken.chainId,
    slippage: 1,
    dstChainId: dstToken.chainId,
    sender: connectedAddress,
  };
};

enum SwapDirection {
  EXACT_AMOUNT_IN = 'exact-amount-in',
  EXACT_AMOUNT_OUT = 'exact-amount-out',
}

const makeAmountInActionConfig = (
  dstToken: TokenInfo,
  toAddress: string,
  srcToken: TokenInfo,
  srcAmount: string
) => {
  return {
    chainId: dstToken.chainId,
    swapDirection: SwapDirection.EXACT_AMOUNT_IN,
    amount: parseUnits(srcAmount, srcToken.decimals),
    receiverAddress: toAddress,
  };
};

const makeAmountOutActionConfig = (
  dstToken: TokenInfo,
  toAddress: string,
  dstAmount: string
) => {
  return {
    chainId: dstToken.chainId,
    swapDirection: SwapDirection.EXACT_AMOUNT_OUT,
    amount: parseUnits(dstAmount, dstToken.decimals),
    receiverAddress: toAddress,
  };
};
