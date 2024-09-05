import deploymentInfo from '@coordinape/contracts/deploymentInfo.json' assert { type: 'json' };
import { WalletClient, getContract } from 'viem';

import { CoLinksABI, CoSoulABI } from '../../contracts/abis';
import { chain } from '../../features/cosoul/chains';

import { ReadOnlyClient, getReadOnlyClient } from './publicClient';

const requiredContracts = ['CoSoul'];

export const supportedChainIds: string[] = Object.entries(deploymentInfo)
  .filter(([, contracts]) => requiredContracts.every(c => c in contracts))
  .map(x => x[0].toString());

export type CoLinks = ReturnType<typeof getCoLinksContract>;
export const getCoLinksContract = () => {
  const publicClient = getReadOnlyClient();

  return getContract({
    address: getContractAddress('CoLinks'),
    abi: CoLinksABI,
    client: publicClient,
  });
};

export type CoLinksWithWallet = ReturnType<typeof getCoLinksContractWithWallet>;

// only for use in FE
export const getCoLinksContractWithWallet = (walletClient: WalletClient) => {
  return getContract({
    address: getContractAddress('CoLinks'),
    abi: CoLinksABI,
    client: {
      wallet: walletClient,
      public: getReadOnlyClient(),
    },
  });
};

export type CoSoul = ReturnType<typeof getCoSoulContract>;
export const getCoSoulContract = (publicClient?: ReadOnlyClient) => {
  const client = publicClient ?? getReadOnlyClient();

  return getContract({
    address: getContractAddress('CoSoul'),
    abi: CoSoulABI,
    client: client,
  });
};

export type CoSoulWithWallet = ReturnType<typeof getCoSoulContractWithWallet>;
export const getCoSoulContractWithWallet = (walletClient: WalletClient) => {
  return getContract({
    address: getContractAddress('CoSoul'),
    abi: CoSoulABI,
    client: {
      wallet: walletClient,
    },
  });
};

type ContractNames = 'CoSoul' | 'CoLinks';

export const getContractAddress = (contractName: ContractNames) => {
  const chainId = Number(chain.chainId);
  const info = (deploymentInfo as any)[chainId];
  if (!info) {
    throw new Error(`No info for chain ${chainId}`);
  }
  return info[contractName].address;
};
