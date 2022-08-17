import deploymentInfo from '@coordinape/hardhat/dist/deploymentInfo.json';
import type {
  ApeDistributor,
  ApeRouter,
  ApeVaultFactory,
  ApeVaultWrapperImplementation,
  ERC20,
} from '@coordinape/hardhat/dist/typechain';
import {
  ApeDistributor__factory,
  ApeRouter__factory,
  ApeVaultFactory__factory,
  ApeVaultWrapperImplementation__factory,
  ERC20__factory,
  VaultAPI__factory,
} from '@coordinape/hardhat/dist/typechain';
import type { JsonRpcProvider } from '@ethersproject/providers';

export type {
  ApeDistributor,
  ApeRouter,
  ApeVaultFactory,
  ApeVaultWrapperImplementation,
  ERC20,
} from '@coordinape/hardhat/dist/typechain';

const requiredContracts = ['ApeVaultFactory', 'ApeRouter', 'ApeDistributor'];

export const supportedChainIds: string[] = Object.entries(deploymentInfo)
  .filter(([, contracts]) => requiredContracts.every(c => c in contracts))
  .map(x => x[0].toString());

export class ContractsReadonly {
  vaultFactory: ApeVaultFactory;
  router: ApeRouter;
  distributor: ApeDistributor;
  chainId: string;
  provider: JsonRpcProvider;

  constructor(chainId: number | string, provider: JsonRpcProvider) {
    this.chainId = chainId.toString();
    this.provider = provider;

    const info = (deploymentInfo as any)[chainId];
    if (!info) {
      throw new Error(`No info for chain ${chainId}`);
    }
    this.vaultFactory = ApeVaultFactory__factory.connect(
      info.ApeVaultFactory.address,
      this.provider
    );
    this.router = ApeRouter__factory.connect(
      info.ApeRouter.address,
      this.provider
    );
    this.distributor = ApeDistributor__factory.connect(
      info.ApeDistributor.address,
      this.provider
    );
  }

  getDeploymentInfo(): Record<string, any> {
    return (deploymentInfo as any)[this.chainId];
  }

  getVault(address: string): ApeVaultWrapperImplementation {
    return ApeVaultWrapperImplementation__factory.connect(
      address,
      this.provider
    );
  }

  async getYVault(vaultAddress: string) {
    const yVaultAddress = await this.getVault(vaultAddress).vault();
    return VaultAPI__factory.connect(yVaultAddress, this.provider);
  }

  getERC20(address: string): ERC20 {
    return ERC20__factory.connect(address, this.provider);
  }
}
