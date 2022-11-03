export const loginSupportedChainIds: { [key: number]: string } = {
  1: 'Ethereum Mainnet',
  10: 'Optimism',
  100: 'Gnosis',
  137: 'Polygon',
  250: 'Fantom Opera',
  42220: 'Celo Mainnet',
  42161: 'Arbitrum One',
  43114: 'Avalanche C-Chain',
};

export async function switchNetwork(
  targetChainId: string,
  onError?: (e: Error | any) => void
): Promise<void> {
  const ethereum = (window as any).ethereum;
  if (!ethereum) {
    return;
  }
  // convert decimal string to hex
  const targetChainIdHex = '0x' + parseInt(targetChainId).toString(16);

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: targetChainIdHex }],
    });
    // refresh
    (window as any).location.reload();
  } catch (error: Error | any) {
    onError && onError(error);
  }
}
