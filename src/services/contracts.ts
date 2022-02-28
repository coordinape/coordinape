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
import * as ethers from 'ethers';

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
    const token = info[symbol];
    if (!token) {
      throw new Error(`No info for token "${symbol}" on chain ${this.chainId}`);
    }
    return this.getERC20(token.address);
  }

  getERC20(address: string): ERC20 {
    return ERC20__factory.connect(address, this.signerOrProvider);
  }

  getMyAddress() {
    return this.signerOrProvider instanceof ethers.ethers.Signer
      ? this.signerOrProvider.getAddress()
      : undefined;
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
    const info = (deploymentInfo as any)[chainId];
    if (!info) {
      throw new Error(`No info for chain ${chainId}`);
    }
    return Contracts.fromAddresses(
      {
        vaultFactory: info.ApeVaultFactoryBeacon.address,
        router: info.ApeRouter.address,
        distributor: info.ApeDistributor.address,
      },
      signerOrProvider,
      chainId
    );
  }

  static fromAddresses(
    addresses: { vaultFactory: string; router: string; distributor: string },
    signerOrProvider: SignerOrProvider,
    chainId: number
  ): Contracts {
    return new Contracts(
      {
        vaultFactory: ApeVaultFactoryBeacon__factory.connect(
          addresses.vaultFactory,
          signerOrProvider
        ),
        router: ApeRouter__factory.connect(addresses.router, signerOrProvider),
        distributor: ApeDistributor__factory.connect(
          addresses.distributor,
          signerOrProvider
        ),
      },
      chainId,
      signerOrProvider
    );
  }
}
