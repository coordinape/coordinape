import { TokenInfo } from '@decent.xyz/box-common';
import { useUsersBalances } from '@decent.xyz/box-hooks';

export function useBalance(walletAddress?: string, token?: TokenInfo) {
  const enable = !!walletAddress && !!token;

  const balances = useUsersBalances({
    address: walletAddress,
    chainId: token?.chainId ?? 1,
    enable,
  });
  const tokenBalanceInfo = balances.tokens?.find(
    t => t.address === token?.address
  );

  const nativeBalanceInfo = balances.tokens?.find(t => t.isNative);

  return {
    tokenBalance: tokenBalanceInfo?.balanceFloat || 0,
    nativeBalance: nativeBalanceInfo?.balanceFloat || 0,
  };
}
