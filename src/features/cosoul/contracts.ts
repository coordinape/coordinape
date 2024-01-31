import assert from 'assert';

import deploymentInfo from '@coordinape/hardhat/dist/deploymentInfo.json';
import { CoLinks__factory } from '@coordinape/hardhat/dist/typechain';
import { CoSoul } from '@coordinape/hardhat/dist/typechain/CoSoul';
import { CoSoul__factory } from '@coordinape/hardhat/dist/typechain/factories/CoSoul__factory';
import type { Signer } from '@ethersproject/abstract-signer';
import type { JsonRpcProvider } from '@ethersproject/providers';

import { getReadOnlyProvider } from '../../utils/provider';

import { chain } from './chains';

const requiredContracts = ['CoSoul'];

export const supportedChainIds: string[] = Object.entries(deploymentInfo)
  .filter(([, contracts]) => requiredContracts.every(c => c in contracts))
  .map(x => x[0].toString());

export const getCoLinksContract = () => {
  const chainId = Number(chain.chainId);
  const provider = getReadOnlyProvider(chainId);
  if (!provider) {
    throw new Error(`no provider available for chain ${chainId}`);
  }
  const info = (deploymentInfo as any)[chainId];
  if (!info) {
    throw new Error(`No info for chain ${chainId}`);
  }
  return CoLinks__factory.connect(info.CoLinks.address, provider);
};

export const getCoLinksContractWithSigner = (
  signerProvider: JsonRpcProvider
) => {
  const chainId = Number(chain.chainId);
  const info = (deploymentInfo as any)[chainId];
  if (!info) {
    throw new Error(`No info for chain ${chainId}`);
  }
  return CoLinks__factory.connect(
    info.CoLinks.address,
    signerProvider.getSigner()
  );
};

export class Contracts {
  cosoul: CoSoul;
  chainId: string;
  provider: JsonRpcProvider;
  private _signer?: Signer;

  constructor(
    chainId: number,
    signerProvider: JsonRpcProvider,
    readonly = false
  ) {
    this.chainId = chainId.toString();
    this.provider = signerProvider;

    if (!readonly) this._signer = signerProvider.getSigner();

    const info = (deploymentInfo as any)[chainId];
    if (!info) {
      throw new Error(`No info for chain ${chainId}`);
    }
    // TODO: deal with this too
    this.cosoul = CoSoul__factory.connect(
      info.CoSoul.address,
      this.signerOrProvider
    );
  }

  static async fromProvider(provider: JsonRpcProvider) {
    const { chainId } = await provider.getNetwork();
    return new Contracts(chainId, provider);
  }

  get signer() {
    assert(this._signer, 'Contracts instance is read-only');
    return this._signer;
  }

  get signerOrProvider() {
    return this._signer || this.provider;
  }

  getDeploymentInfo(): Record<string, any> {
    return (deploymentInfo as any)[this.chainId];
  }
}
