import apeDistributorInfo from '@coordinape/hardhat/dist/deployments/localhost/ApeDistributor.json';
import apeRouterInfo from '@coordinape/hardhat/dist/deployments/localhost/ApeRouter.json';
import apeTokenInfo from '@coordinape/hardhat/dist/deployments/localhost/ApeToken.json';
import apeVaultFactoryInfo from '@coordinape/hardhat/dist/deployments/localhost/ApeVaultFactory.json';
import feeRegistryInfo from '@coordinape/hardhat/dist/deployments/localhost/FeeRegistry.json';
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
} from '@coordinape/hardhat/dist/typechain';
import * as ethers from 'ethers';

import { getContractAddress, getToken } from 'config/networks';

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

  // Todo: In future allow for different networks
  // convert deployments into easily accessible shape
  static fromLocalhost(provider: ethers.providers.Provider): Contracts {
    const networkId = 1337;
    return Contracts.fromAddresses(
      {
        apeToken: apeTokenInfo.address,
        apeVaultFactory: apeVaultFactoryInfo.address,
        apeRouter: apeRouterInfo.address,
        apeDistributor: apeDistributorInfo.address,
        feeRegistry: feeRegistryInfo.address,
        usdc: getToken(networkId, 'usdc').address,
        usdcYVault: getToken(networkId, 'yvUsdc').address,
        yRegistry: getContractAddress(networkId, 'yRegistry'),
      },
      provider
    );
  }
}
