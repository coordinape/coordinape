import deploymentInfo from '@coordinape/hardhat/dist/deploymentInfo.json';
import {
  ApeDistributor__factory,
  ApeRouter__factory,
  ApeVaultFactoryBeacon__factory,
  ApeVaultWrapperImplementation__factory,
  ERC20__factory,
  VaultAPI__factory,
} from '@coordinape/hardhat/dist/typechain';
import type {
  ApeDistributor,
  ApeRouter,
  ApeVaultFactoryBeacon,
  ApeVaultWrapperImplementation,
  ERC20,
} from '@coordinape/hardhat/dist/typechain';
import type { Signer } from '@ethersproject/abstract-signer';
import type { JsonRpcProvider } from '@ethersproject/providers';
import debug from 'debug';
import { BigNumber, FixedNumber } from 'ethers';

import { HARDHAT_CHAIN_ID, HARDHAT_GANACHE_CHAIN_ID } from 'config/env';

import { Asset } from './';
import { hasSimpleToken } from './tokens';

export type {
  ApeDistributor,
  ApeRouter,
  ApeVaultFactoryBeacon,
  ApeVaultWrapperImplementation,
  ERC20,
} from '@coordinape/hardhat/dist/typechain';

const log = debug('coordinape:contracts');

const requiredContracts = [
  'ApeVaultFactoryBeacon',
  'ApeRouter',
  'ApeDistributor',
];

export const supportedChainIds: string[] = Object.entries(deploymentInfo)
  .filter(([, contracts]) => requiredContracts.every(c => c in contracts))
  .map(x => x[0].toString());

export class Contracts {
  vaultFactory: ApeVaultFactoryBeacon;
  router: ApeRouter;
  distributor: ApeDistributor;
  chainId: string;
  provider: JsonRpcProvider;
  signer: Signer;

  constructor(chainId: number | string, provider: JsonRpcProvider) {
    this.chainId = chainId.toString();
    this.provider = provider;
    this.signer = provider.getSigner();

    const info = (deploymentInfo as any)[chainId];
    if (!info) {
      throw new Error(`No info for chain ${chainId}`);
    }
    this.vaultFactory = ApeVaultFactoryBeacon__factory.connect(
      info.ApeVaultFactoryBeacon.address,
      this.signer
    );
    this.router = ApeRouter__factory.connect(
      info.ApeRouter.address,
      this.signer
    );
    this.distributor = ApeDistributor__factory.connect(
      info.ApeDistributor.address,
      this.signer
    );
  }

  getDeploymentInfo(): Record<string, any> {
    return (deploymentInfo as any)[this.chainId];
  }

  getVault(address: string): ApeVaultWrapperImplementation {
    return ApeVaultWrapperImplementation__factory.connect(address, this.signer);
  }

  async getYVault(vaultAddress: string) {
    const yVaultAddress = await this.getVault(vaultAddress).vault();
    return VaultAPI__factory.connect(yVaultAddress, this.provider);
  }

  // returns value ready to be converted to float, i.e. 1.5, not 1500000
  async getPricePerShare(
    vaultAddress: string,
    simple_token_address: string,
    decimals: number
  ) {
    if (hasSimpleToken({ simple_token_address })) return FixedNumber.from(1);
    const pps = await (await this.getYVault(vaultAddress)).pricePerShare();
    const shifter = FixedNumber.from(BigNumber.from(10).pow(decimals));
    return FixedNumber.from(pps).divUnsafe(shifter);
  }

  getAvailableTokens() {
    return Object.values(Asset).filter(s => !!this.getTokenAddress(s));
  }

  getTokenAddress(symbol: string) {
    const info = (deploymentInfo as any)[this.chainId];
    let { address } = info[symbol] || {};

    // workaround for mainnet-forked testchains
    if (
      !address &&
      [
        HARDHAT_CHAIN_ID.toString(),
        HARDHAT_GANACHE_CHAIN_ID.toString(),
      ].includes(this.chainId)
    ) {
      address = (deploymentInfo as any)[1][symbol]?.address;
      if (!address) return undefined;
      log(
        `No info for token "${symbol}" on chain ${this.chainId}; using mainnet address`
      );
    }

    return address;
  }

  getToken(symbol: string) {
    const address = this.getTokenAddress(symbol);
    if (!address)
      throw new Error(`No info for token "${symbol}" on chain ${this.chainId}`);

    return this.getERC20(address);
  }

  getERC20(address: string): ERC20 {
    return ERC20__factory.connect(address, this.signer);
  }

  getMyAddress() {
    return this.signer.getAddress();
  }

  async getETHBalance(address?: string) {
    if (!address && this.signer) return this.signer.getBalance('latest');

    if (!address) {
      throw new Error(
        'address argument is required when signer is not available'
      );
    }
    return this.provider.getBalance(address, 'latest');
  }
}
