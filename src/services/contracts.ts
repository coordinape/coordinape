import deploymentInfo from '@coordinape/hardhat/dist/deploymentInfo.json';
import {
  ApeDistributor,
  ApeDistributor__factory,
  ApeRouter,
  ApeRouter__factory,
  ApeToken,
  ApeToken__factory,
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
  apeToken: ApeToken;
  apeVaultFactory: ApeVaultFactoryBeacon;
  apeRouter: ApeRouter;
  apeDistributor: ApeDistributor;

  // TODO this might not be quite the right way to do this, as the signer/provider
  // used to create the contracts also has a network associated with it
  chainId: number;

  signerOrProvider: SignerOrProvider;

  constructor(
    contracts: {
      apeToken: ApeToken;
      apeVaultFactory: ApeVaultFactoryBeacon;
      apeRouter: ApeRouter;
      apeDistributor: ApeDistributor;
    },
    chainId: number,
    signerOrProvider: SignerOrProvider
  ) {
    this.apeToken = contracts.apeToken;
    this.apeVaultFactory = contracts.apeVaultFactory;
    this.apeRouter = contracts.apeRouter;
    this.apeDistributor = contracts.apeDistributor;
    this.chainId = chainId;
    this.signerOrProvider = signerOrProvider;
  }

  connect(signer: ethers.Signer): void {
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
        apeToken: info.ApeToken.address,
        apeVaultFactory: info.ApeVaultFactoryBeacon.address,
        apeRouter: info.ApeRouter.address,
        apeDistributor: info.ApeDistributor.address,
      },
      signerOrProvider,
      chainId
    );
  }

  static fromAddresses(
    addresses: {
      apeToken: string;
      apeVaultFactory: string;
      apeRouter: string;
      apeDistributor: string;
    },
    signerOrProvider: SignerOrProvider,
    chainId: number
  ): Contracts {
    const apeToken = ApeToken__factory.connect(
      addresses.apeToken,
      signerOrProvider
    );
    const apeVaultFactory = ApeVaultFactoryBeacon__factory.connect(
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
        apeToken,
        apeVaultFactory,
        apeRouter,
        apeDistributor,
      },
      chainId,
      signerOrProvider
    );
  }
}
