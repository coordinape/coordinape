import { Signer } from 'ethers';
import { deployments, ethers, getNamedAccounts } from 'hardhat';

import {
  USDC_ADDRESS,
  USDC_WHALE_ADDRESS,
  USDC_YVAULT_ADDRESS,
  YEARN_REGISTRY_ADDRESS,
} from '../../constants';
import {
  ApeDistributor,
  ApeDistributor__factory,
  ApeRouter,
  ApeRouter__factory,
  ApeToken,
  ApeToken__factory,
  ApeVaultFactoryBeacon,
  ApeVaultFactoryBeacon__factory,
  ERC20,
  ERC20__factory,
  FeeRegistry,
  FeeRegistry__factory,
  RegistryAPI,
  RegistryAPI__factory,
  VaultAPI,
  VaultAPI__factory,
} from '../../typechain';
import { unlockSigner } from '../../utils/unlockSigner';

import { Account, getAccountFromSigner } from './account';

export type DeployedContracts = {
  usdc: ERC20;
  usdcYVault: VaultAPI;
  yRegistry: RegistryAPI;
  apeToken: ApeToken;
  apeVaultFactory: ApeVaultFactoryBeacon;
  apeRouter: ApeRouter;
  apeDistributor: ApeDistributor;
  feeRegistry: FeeRegistry;
};

export type DeploymentInfo = {
  contracts: DeployedContracts;
  deployer: Account;
  accounts: Account[];
};

export async function deployProtocolFixture(): Promise<DeploymentInfo> {
  const fixture = await deployments.fixture();
  const signers = await ethers.getSigners();
  const accounts: Account[] = await Promise.all(
    signers.map((account: Signer) => getAccountFromSigner(account))
  );
  const { deployerAddress } = await getNamedAccounts();
  const deployerSigner = await ethers.getSigner(deployerAddress);
  const deployer = {
    address: deployerAddress,
    signer: deployerSigner,
  };

  const usdcWhale = await unlockSigner(USDC_WHALE_ADDRESS);

  const contracts = {
    usdc: ERC20__factory.connect(USDC_ADDRESS, usdcWhale),
    usdcYVault: VaultAPI__factory.connect(USDC_YVAULT_ADDRESS, usdcWhale),
    yRegistry: RegistryAPI__factory.connect(
      YEARN_REGISTRY_ADDRESS,
      deployer.signer
    ),
    apeToken: ApeToken__factory.connect(
      fixture['ApeToken'].address,
      deployer.signer
    ),
    apeVaultFactory: ApeVaultFactoryBeacon__factory.connect(
      fixture['ApeVaultFactoryBeacon'].address,
      deployer.signer
    ),
    apeRouter: ApeRouter__factory.connect(
      fixture['ApeRouter'].address,
      deployer.signer
    ),
    apeDistributor: ApeDistributor__factory.connect(
      fixture['ApeDistributor'].address,
      deployer.signer
    ),
    feeRegistry: FeeRegistry__factory.connect(
      fixture['FeeRegistry'].address,
      deployer.signer
    ),
  };

  return {
    contracts,
    deployer,
    accounts,
  };
}
