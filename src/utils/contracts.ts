import deploymentInfo from '@coordinape/hardhat/deploymentInfo.json';
import {
  ApeDistributor,
  ApeDistributor__factory,
  ApeRouter,
  ApeRouter__factory,
  ApeToken,
  ApeToken__factory,
  ApeVaultFactory,
  ApeVaultFactory__factory,
  ERC20,
  ERC20__factory,
  FeeRegistry,
  FeeRegistry__factory,
  RegistryAPI,
  RegistryAPI__factory,
  VaultAPI,
  VaultAPI__factory,
} from '@coordinape/hardhat/typechain';
import * as ethers from 'ethers';

import { getContractAddress, getToken } from 'config/networks';

import { NetworkId } from 'types';

export class Contracts {
  usdc: ERC20;
  usdcYVault: VaultAPI;
  yRegistry: RegistryAPI;
  apeToken: ApeToken;
  apeVaultFactory: ApeVaultFactory;
  apeRouter: ApeRouter;
  apeDistributor: ApeDistributor;
  feeRegistry: FeeRegistry;

  constructor(contracts: {
    usdc: ERC20;
    usdcYVault: VaultAPI;
    yRegistry: RegistryAPI;
    apeToken: ApeToken;
    apeVaultFactory: ApeVaultFactory;
    apeRouter: ApeRouter;
    apeDistributor: ApeDistributor;
    feeRegistry: FeeRegistry;
  }) {
    this.usdc = contracts.usdc;
    this.usdcYVault = contracts.usdcYVault;
    this.yRegistry = contracts.yRegistry;
    this.apeToken = contracts.apeToken;
    this.apeVaultFactory = contracts.apeVaultFactory;
    this.apeRouter = contracts.apeRouter;
    this.apeDistributor = contracts.apeDistributor;
    this.feeRegistry = contracts.feeRegistry;
  }

  connect(signer: ethers.Signer): void {
    this.usdc = this.usdc.connect(signer);
    this.usdcYVault = this.usdcYVault.connect(signer);
    this.yRegistry = this.yRegistry.connect(signer);
    this.apeToken = this.apeToken.connect(signer);
    this.apeVaultFactory = this.apeVaultFactory.connect(signer);
    this.apeRouter = this.apeRouter.connect(signer);
    this.apeDistributor = this.apeDistributor.connect(signer);
    this.feeRegistry = this.feeRegistry.connect(signer);
  }

  static fromAddresses(
    addresses: {
      usdc: string;
      usdcYVault: string;
      yRegistry: string;
      apeToken: string;
      apeVaultFactory: string;
      apeRouter: string;
      apeDistributor: string;
      feeRegistry: string;
    },
    provider: ethers.providers.Provider
  ): Contracts {
    const usdc = ERC20__factory.connect(addresses.usdc, provider);
    const usdcYVault = VaultAPI__factory.connect(
      addresses.usdcYVault,
      provider
    );
    const yRegistry = RegistryAPI__factory.connect(
      addresses.yRegistry,
      provider
    );
    const apeToken = ApeToken__factory.connect(addresses.apeToken, provider);
    const apeVaultFactory = ApeVaultFactory__factory.connect(
      addresses.apeVaultFactory,
      provider
    );
    const apeRouter = ApeRouter__factory.connect(addresses.apeRouter, provider);
    const apeDistributor = ApeDistributor__factory.connect(
      addresses.apeDistributor,
      provider
    );
    const feeRegistry = FeeRegistry__factory.connect(
      addresses.feeRegistry,
      provider
    );
    return new Contracts({
      usdc,
      usdcYVault,
      yRegistry,
      apeToken,
      apeVaultFactory,
      apeRouter,
      apeDistributor,
      feeRegistry,
    });
  }

  static fromNetwork(
    networkId: NetworkId,
    provider: ethers.providers.Provider
  ): Contracts {
    return Contracts.fromAddresses(
      {
        apeToken: (deploymentInfo as any)[networkId].ApeToken.address,
        apeVaultFactory: (deploymentInfo as any)[networkId].ApeVaultFactory
          .address,
        apeRouter: (deploymentInfo as any)[networkId].ApeRouter.address,
        apeDistributor: (deploymentInfo as any)[networkId].ApeDistributor
          .address,
        feeRegistry: (deploymentInfo as any)[networkId].FeeRegistry.address,
        usdc: getToken(networkId, 'usdc').address,
        usdcYVault: getToken(networkId, 'yvUsdc').address,
        yRegistry: getContractAddress(networkId, 'yRegistry'),
      },
      provider
    );
  }
}
