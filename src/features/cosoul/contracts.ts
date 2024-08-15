import assert from 'assert';

import deploymentInfo from '@coordinape/contracts/deploymentInfo.json' assert { type: 'json' };
import { PublicClient, WalletClient, getContract } from 'viem';

import { CoLinksABI, CoSoulABI } from '../../../contracts/abis';
import { getReadOnlyClient } from '../../utils/viem/publicClient';

import { chain } from './chains';

const requiredContracts = ['CoSoul'];

export const supportedChainIds: string[] = Object.entries(deploymentInfo)
  .filter(([, contracts]) => requiredContracts.every(c => c in contracts))
  .map(x => x[0].toString());

export const getCoLinksContract = () => {
  const chainId = Number(chain.chainId);

  const publicClient = getReadOnlyClient(chainId);
  if (!publicClient) {
    throw new Error(`no publicClient available for chain ${chainId}`);
  }

  const info = (deploymentInfo as any)[chainId];
  if (!info) {
    throw new Error(`No info for chain ${chainId}`);
  }
  return getContract({
    address: info.CoLinks.address,
    abi: CoLinksABI,
    client: publicClient,
  });
};

export const getCoLinksContractWithWallet = (walletClient: WalletClient) => {
  const chainId = Number(chain.chainId);
  const info = (deploymentInfo as any)[chainId];
  if (!info) {
    throw new Error(`No info for chain ${chainId}`);
  }
  return getContract({
    address: info.CoLinks.address,
    abi: CoLinksABI,
    client: walletClient, // alt approach client: { wallet: walletClient }, //TODO: use publicCLient for read
  });
};

export class Contracts {
  cosoul: ReturnType<typeof getContract>;
  chainId: string;
  publicClient: PublicClient;
  private _walletClient?: WalletClient;

  constructor(
    chainId: number,
    publicClient: PublicClient,
    walletClient?: WalletClient
  ) {
    this.chainId = chainId.toString();
    this.publicClient = publicClient;
    this._walletClient = walletClient;

    const info = (deploymentInfo as any)[chainId];
    if (!info) {
      throw new Error(`No info for chain ${chainId}`);
    }

    this.cosoul = getContract({
      address: info.CoSoul.address,
      abi: CoSoulABI,
      client: this.publicClient,
    });
  }

  static async fromPublicClient(publicClient: PublicClient) {
    const chainId = await publicClient.getChainId();
    return new Contracts(chainId, publicClient);
  }

  get walletClient() {
    assert(this._walletClient, 'Contracts instance is read-only');
    return this._walletClient;
  }

  getDeploymentInfo(): Record<string, any> {
    return (deploymentInfo as any)[this.chainId];
  }
}
