import deploymentInfo from '@coordinape/hardhat/dist/deploymentInfo.json';
import {
  ApeDistributor,
  ApeDistributor__factory,
  ApeRouter,
  ApeRouter__factory,
  ApeToken,
  ApeToken__factory,
  ApeVaultFactory,
  ApeVaultFactory__factory,
  ApeVaultWrapperImplementation,
  ApeVaultWrapperImplementation__factory,
  ERC20,
  ERC20__factory,
} from '@coordinape/hardhat/dist/typechain';
import * as ethers from 'ethers';

import { getToken, NetworkId } from 'config/networks';

type SignerOrProvider = ethers.providers.Provider | ethers.ethers.Signer;

export class Contracts {
  usdc: ERC20;
  apeToken: ApeToken;
  apeVaultFactory: ApeVaultFactory;
  apeRouter: ApeRouter;
  apeDistributor: ApeDistributor;

  // TODO this might not be quite the right way to do this, as the signer/provider
  // used to create the contracts also has a network associated with it
  networkId: NetworkId;

  signerOrProvider: SignerOrProvider;

  constructor(
    contracts: {
      usdc: ERC20;
      apeToken: ApeToken;
      apeVaultFactory: ApeVaultFactory;
      apeRouter: ApeRouter;
      apeDistributor: ApeDistributor;
    },
    networkId: NetworkId,
    signerOrProvider: SignerOrProvider
  ) {
    this.usdc = contracts.usdc;
    this.apeToken = contracts.apeToken;
    this.apeVaultFactory = contracts.apeVaultFactory;
    this.apeRouter = contracts.apeRouter;
    this.apeDistributor = contracts.apeDistributor;
    this.networkId = networkId;
    this.signerOrProvider = signerOrProvider;
  }

  connect(signer: ethers.Signer): void {
    this.usdc = this.usdc.connect(signer);
    this.apeToken = this.apeToken.connect(signer);
    this.apeVaultFactory = this.apeVaultFactory.connect(signer);
    this.apeRouter = this.apeRouter.connect(signer);
    this.apeDistributor = this.apeDistributor.connect(signer);
  }

  getVault(address: string): ApeVaultWrapperImplementation {
    return ApeVaultWrapperImplementation__factory.connect(
      address,
      this.signerOrProvider
    );
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

  static fromNetwork(
    networkId: NetworkId,
    signerOrProvider: SignerOrProvider
  ): Contracts {
    return Contracts.fromAddresses(
      {
        apeToken: (deploymentInfo as any)[networkId].ApeToken.address,
        apeVaultFactory: (deploymentInfo as any)[networkId].ApeVaultFactory
          .address,
        apeRouter: (deploymentInfo as any)[networkId].ApeRouter.address,
        apeDistributor: (deploymentInfo as any)[networkId].ApeDistributor
          .address,
        usdc: getToken(networkId, 'USDC').address,
      },
      signerOrProvider,
      networkId
    );
  }

  static fromAddresses(
    addresses: {
      usdc: string;
      apeToken: string;
      apeVaultFactory: string;
      apeRouter: string;
      apeDistributor: string;
    },
    signerOrProvider: SignerOrProvider,
    networkId: NetworkId
  ): Contracts {
    const usdc = ERC20__factory.connect(addresses.usdc, signerOrProvider);
    const apeToken = ApeToken__factory.connect(
      addresses.apeToken,
      signerOrProvider
    );
    const apeVaultFactory = ApeVaultFactory__factory.connect(
      addresses.apeVaultFactory,
      signerOrProvider
    );
    const apeRouter = ApeRouter__factory.connect(
      addresses.apeRouter,
      signerOrProvider
    );
    const apeDistributor = ApeDistributor__factory.connect(
      addresses.apeDistributor,
      signerOrProvider
    );
    return new Contracts(
      {
        usdc,
        apeToken,
        apeVaultFactory,
        apeRouter,
        apeDistributor,
      },
      networkId,
      signerOrProvider
    );
  }
}
