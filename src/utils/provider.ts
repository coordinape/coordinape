import { Wallet } from 'ethers';

export const getSignature = async (
  data: string,
  provider?: any
): Promise<string> => {
  if (!provider)
    return new Promise((resolve) => {
      resolve('');
    });
  const signer: Wallet = provider.getSigner();
  return signer.signMessage(data);
};
