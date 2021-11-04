import { Signer } from 'ethers';
import { deployments, ethers, getNamedAccounts } from 'hardhat';

import {
  ApeDistributor,
  ApeDistributor__factory,
  ApeRouter,
  ApeRouter__factory,
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
} from '../../typechain';
import {
  USDC_ADDRESS,
  USDC_WHALE_ADDRESS,
  USDC_YVAULT_ADDRESS,
  YEARN_REGISTRY_ADDRESS,
} from '../constants';

import { Account, getAccountFromSigner } from './account';
import { unlockSigner } from './unlockSigner';

export type DeployedContracts = {
  usdc: ERC20;
  usdcYVault: VaultAPI;
  yRegistry: RegistryAPI;
  apeVaultFactory: ApeVaultFactory;
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
  ApeVaultFactory__factory.connect(
    fixture['ApeVaultFactory'].address,
    deployer.signer
  );

  const contracts = {
    usdc: ERC20__factory.connect(USDC_ADDRESS, usdcWhale),
    usdcYVault: VaultAPI__factory.connect(USDC_YVAULT_ADDRESS, usdcWhale),
    yRegistry: RegistryAPI__factory.connect(
      YEARN_REGISTRY_ADDRESS,
      deployer.signer
    ),
    apeVaultFactory: ApeVaultFactory__factory.connect(
      fixture['ApeVaultFactory'].address,
      deployer.signer
    ),
    apeRouter: ApeRouter__factory.connect(
      fixture['ApeRouter'].address,
      deployer.signer
    ),
    apeDistributor: ApeDistributor__factory.connect(
      fixture['ApeRouter'].address,
      deployer.signer
    ),
    feeRegistry: FeeRegistry__factory.connect(
      fixture['ApeRouter'].address,
      deployer.signer
    ),
  };

  return {
    contracts,
    deployer,
    accounts,
  };
}
