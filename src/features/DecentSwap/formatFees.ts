import { ChainId } from '@decent.xyz/box-common';
import { formatUnits } from 'viem';

export const formatFees = (
  appFee: bigint,
  bridgeFee: bigint,
  srcChain: ChainId
) => {
  const symbol = srcChain === ChainId.POLYGON ? 'MATIC' : 'ETH';
  const format = (fee: bigint) => {
    return fee ? parseFloat(formatUnits(fee, 18)).toFixed(4) : fee;
  };
  const fees: Record<string, string> = {
    ['App Fees']: `${format(appFee)} ${symbol}`,
    ['Bridge Fees']: `${format(bridgeFee)} ${symbol}`,
  };
  return fees;
};
