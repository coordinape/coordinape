import { Signer } from 'ethers';
import { deployments, ethers, getNamedAccounts } from 'hardhat';

import {
  CoLinks,
  CoLinks__factory,
  CoSoul,
  CoSoul__factory,
  COToken,
  COToken__factory,
} from '../../typechain';

import { Account, getAccountFromSigner } from './account';

export type DeployedContracts = {
  coToken: COToken;
  coSoul: CoSoul;
  coLinks: CoLinks;
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

  // const usdcWhale = await unlockSigner(USDC_WHALE_ADDRESS, { ethers, network });

  const contracts = {
    coToken: COToken__factory.connect(
      fixture['COToken'].address,
      deployer.signer
    ),
    coSoul: CoSoul__factory.connect(fixture['CoSoul'].address, deployer.signer),
    coLinks: CoLinks__factory.connect(
      fixture['CoLinks'].address,
      deployer.signer
    ),
  };

  return {
    contracts,
    deployer,
    accounts,
  };
}
