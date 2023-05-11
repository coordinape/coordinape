/* eslint-disable no-console */
import assert from 'assert';

import deploymentInfo from '@coordinape/hardhat/dist/deploymentInfo.json';
import { CoSoul, CoSoul__factory } from '@coordinape/hardhat/dist/typechain';
import type { Signer } from '@ethersproject/abstract-signer';
import type { JsonRpcProvider } from '@ethersproject/providers';

export type {
  ApeDistributor,
  ApeRouter,
  ApeVaultFactory,
  ApeVaultWrapperImplementation,
  ERC20,
} from '@coordinape/hardhat/dist/typechain';

const requiredContracts = ['CoSoul'];

export const supportedChainIds: string[] = Object.entries(deploymentInfo)
  .filter(([, contracts]) => requiredContracts.every(c => c in contracts))
  .map(x => x[0].toString());

export class Contracts {
  cosoul: CoSoul;
  chainId: string;
  provider: JsonRpcProvider;
  private _signer?: Signer;

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
    console.log({ info });
    this.cosoul = CoSoul__factory.connect(
      info.CoSoul.address,
      this.signerOrProvider
    ).attach(info.SoulProxy.address);
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
