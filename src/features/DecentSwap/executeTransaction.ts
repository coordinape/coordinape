import {
  ChainId,
  TokenInfo,
  EvmTransaction,
  BoxActionResponse,
} from '@decent.xyz/box-common';
import { sendTransaction, waitForTransactionReceipt } from '@wagmi/core';
import { wagmiConfig } from 'features/wagmi/config';
import { toast } from 'react-toastify';
import { Address, zeroAddress } from 'viem';
import { Connector } from 'wagmi';

import { EConnectorNames } from 'config/constants';
import { switchNetwork } from 'utils/provider';

import { getAllowance, approveToken } from './approveToken';
import { defaultAvailableChains } from './config';
import {
  generateDecentAmountInParams,
  generateDecentAmountOutParams,
} from './generateDecentParams';
import { RouteVars } from './SwapComponent';

export const confirmRoute = async ({
  srcChain,
  srcToken,
  dstToken,
  setBoxActionArgs,
  setRouteVars,
  connectedAddress,
  chain,
  srcInputVal,
  dstInputVal,
  continueDisabled,
  setSubmitting,
  setShowContinue,
  srcDisplay,
  connector,
}: {
  srcChain: ChainId;
  srcToken: TokenInfo;
  dstToken: TokenInfo;
  setBoxActionArgs: any;
  setRouteVars: React.Dispatch<React.SetStateAction<RouteVars>>;
  connectedAddress: string;
  chain: ChainId;
  srcInputVal?: string;
  dstInputVal?: string;
  continueDisabled?: boolean;
  setSubmitting?: (submitting: boolean) => void;
  setShowContinue?: (showContinue: boolean) => void;
  srcDisplay?: string;
  connector?: Connector;
}) => {
  const toAddress = connectedAddress;
  setBoxActionArgs(undefined);
  if (chain !== srcChain) {
    if (defaultAvailableChains.includes(srcChain)) {
      if (connector?.type === EConnectorNames.Injected) {
        toast.warning('Please switch networks.', {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        await switchNetwork(srcChain.toString());
      } else {
        toast.warning('Please switch networks manually and reconnect.', {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
    return;
  }
  if (continueDisabled) return;
  setSubmitting?.(true);
  setRouteVars(prevState => ({
    ...prevState,
    purchaseName: `${Number(srcDisplay).toPrecision(2)} ${dstToken.symbol}`,
  }));

  if (srcInputVal) {
    const actionArgs = generateDecentAmountInParams({
      srcToken,
      dstToken: dstToken,
      srcAmount: srcInputVal,
      connectedAddress,
      toAddress,
    });
    setBoxActionArgs(actionArgs);
    setShowContinue?.(false);
    setSubmitting?.(false);
  } else if (dstInputVal) {
    const actionArgs = generateDecentAmountOutParams({
      srcToken,
      dstToken: dstToken,
      dstAmount: dstInputVal,
      connectedAddress,
      toAddress,
    });
    setBoxActionArgs(actionArgs);
    setShowContinue?.(false);
    setSubmitting?.(false);
  } else {
    setSubmitting?.(false);
    toast.error('Error finding route.', {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
};

export const executeTransaction = async ({
  connectedAddress,
  actionResponse,
  setSubmitting,
  setShowContinue,
  srcChain,
}: {
  connectedAddress: Address | undefined;
  actionResponse: BoxActionResponse | undefined;
  setSubmitting?: (submitting: boolean) => void;
  setShowContinue?: (showContinue: boolean) => void;
  srcChain: ChainId;
}) => {
  if (!actionResponse) {
    toast.error('Failed to fetch routes', {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  } else {
    setSubmitting?.(true);
    try {
      if (
        actionResponse?.tokenPayment?.tokenAddress &&
        actionResponse.tokenPayment.tokenAddress != zeroAddress
      ) {
        const amountApproved = await getAllowance({
          user: connectedAddress!,
          spender: actionResponse.tx.to as Address,
          token: actionResponse.tokenPayment.tokenAddress as Address,
        });
        if (amountApproved < (actionResponse?.tokenPayment?.amount || 0n)) {
          const approveHash = await approveToken({
            token: actionResponse.tokenPayment.tokenAddress as Address,
            spender: actionResponse.tx.to as Address,
            amount: actionResponse?.tokenPayment?.amount || 0n,
          });
          if (!approveHash) {
            console.error('not approved!');
            return;
          }
          await waitForTransactionReceipt(wagmiConfig, {
            chainId: srcChain,
            hash: approveHash,
          });
        }
      }

      const tx = actionResponse.tx as EvmTransaction;
      await sendTransaction(wagmiConfig, tx);
      setSubmitting?.(false);
    } catch (e: any) {
      if (e?.data?.message?.match(/insufficient funds/)) {
        toast.error('Insufficient funds for gas. Please reduce input amount', {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      } else if (e?.message.match(/user rejected transaction/)) {
        toast.error('User rejected transaction', {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      } else {
        toast.error('Error sending transaction.', {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
      console.error('Error sending tx.', e);
      setShowContinue?.(true);
      setSubmitting?.(false);
    }
  }
};
