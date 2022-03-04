import assert from 'assert';

import deploymentInfo from '@coordinape/hardhat/dist/deploymentInfo.json';
import {
  ApeDistributor,
  ApeDistributor__factory,
  ApeRouter,
  ApeRouter__factory,
  ApeVaultFactoryBeacon,
  ApeVaultFactoryBeacon__factory,
  ApeVaultWrapperImplementation,
  ApeVaultWrapperImplementation__factory,
  ERC20,
  ERC20__factory,
} from '@coordinape/hardhat/dist/typechain';
import debug from 'debug';
import * as ethers from 'ethers';

import { HARDHAT_CHAIN_ID, HARDHAT_GANACHE_CHAIN_ID } from 'config/env';

const log = debug('coordinape:contracts');

type SignerOrProvider = ethers.providers.Provider | ethers.ethers.Signer;

export const supportedChainIds: number[] =
  Object.keys(deploymentInfo).map(Number);

export class Contracts {
  vaultFactory: ApeVaultFactoryBeacon;
  router: ApeRouter;
  distributor: ApeDistributor;

  // TODO this might not be quite the right way to do this, as the
  // signer/provider used to create the contracts also has a network associated
  // with it
  chainId: number;

  signerOrProvider: SignerOrProvider;

  constructor(
    contracts: {
      vaultFactory: ApeVaultFactoryBeacon;
      router: ApeRouter;
      distributor: ApeDistributor;
    },
    chainId: number,
    signerOrProvider: SignerOrProvider
  ) {
    this.vaultFactory = contracts.vaultFactory;
    this.router = contracts.router;
    this.distributor = contracts.distributor;
    this.chainId = chainId;
    this.signerOrProvider = signerOrProvider;
  }

  connect(signer: ethers.Signer): void {
    this.vaultFactory = this.vaultFactory.connect(signer);
    this.router = this.router.connect(signer);
    this.distributor = this.distributor.connect(signer);
  }

  getVault(address: string): ApeVaultWrapperImplementation {
    return ApeVaultWrapperImplementation__factory.connect(
      address,
      this.signerOrProvider
    );
  }

  getToken(symbol: string) {
    const info = (deploymentInfo as any)[this.chainId];
    let { address } = info[symbol] || {};

    // workaround for mainnet-forked testchains
    if (
      !address &&
      [HARDHAT_CHAIN_ID, HARDHAT_GANACHE_CHAIN_ID].includes(this.chainId)
    ) {
      address = (deploymentInfo as any)[1][symbol]?.address;
      if (!address)
        throw new Error(
          `No info for token "${symbol}" on chain ${this.chainId}`
        );
      log(
        `No info for token "${symbol}" on chain ${this.chainId}; using mainnet address`
      );
    }

    return this.getERC20(address);
  }

  getERC20(address: string): ERC20 {
    return ERC20__factory.connect(address, this.signerOrProvider);
  }

  getMyAddress() {
    const signer =
      this.signerOrProvider instanceof ethers.ethers.Signer
        ? this.signerOrProvider
        : (this.signerOrProvider as any).getSigner();
    return signer.getAddress();
  }

  async getETHBalance(address?: string) {
    if (this.signerOrProvider instanceof ethers.ethers.Signer) {
      if (!address) return this.signerOrProvider.getBalance('latest');
      return this.signerOrProvider.provider?.getBalance(address, 'latest');
    }

    if (!address) {
      throw new Error(
        'address argument is required when signer is not available'
      );
    }
    return this.signerOrProvider.getBalance(address, 'latest');
  }

  static forChain(
    chainId: number,
    signerOrProvider: SignerOrProvider
  ): Contracts {
    assert(chainId !== 1, 'No support for mainnet yet');
    const info = (deploymentInfo as any)[chainId];
    if (!info) {
      throw new Error(`No info for chain ${chainId}`);
    }
    return new Contracts(
      {
        vaultFactory: ApeVaultFactoryBeacon__factory.connect(
          info.ApeVaultFactoryBeacon.address,
          signerOrProvider
        ),
        router: ApeRouter__factory.connect(
          info.ApeRouter.address,
          signerOrProvider
        ),
        distributor: ApeDistributor__factory.connect(
          info.ApeDistributor.address,
          signerOrProvider
        ),
      },
      chainId,
      signerOrProvider
    );
  }
}
