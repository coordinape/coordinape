import assert from 'assert';

import deploymentInfo from '@coordinape/hardhat/dist/deploymentInfo.json';
import { SoulKeys__factory } from '@coordinape/hardhat/dist/typechain';
import { CoSoul } from '@coordinape/hardhat/dist/typechain/CoSoul';
import { CoSoul__factory } from '@coordinape/hardhat/dist/typechain/factories/CoSoul__factory';
import { SoulKeys } from '@coordinape/hardhat/dist/typechain/SoulKeys';
import type { Signer } from '@ethersproject/abstract-signer';
import type { JsonRpcProvider } from '@ethersproject/providers';

const requiredContracts = ['CoSoul'];

export const supportedChainIds: string[] = Object.entries(deploymentInfo)
  .filter(([, contracts]) => requiredContracts.every(c => c in contracts))
  .map(x => x[0].toString());

export class Contracts {
  cosoul: CoSoul;
  chainId: string;
  provider: JsonRpcProvider;
  private _signer?: Signer;

  soulKeys: SoulKeys;

  constructor(
    chainId: number | string,
    provider: JsonRpcProvider,
    readonly = false
  ) {
    this.chainId = chainId.toString();
    this.provider = provider;
    if (!readonly) this._signer = provider.getSigner();

    const info = (deploymentInfo as any)[chainId];
    if (!info) {
      throw new Error(`No info for chain ${chainId}`);
    }
    this.cosoul = CoSoul__factory.connect(
      info.CoSoul.address,
      this.signerOrProvider
    );
    this.soulKeys = SoulKeys__factory.connect(
      info.SoulKeys.address,
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
