import { AddressZero } from '@ethersproject/constants';
import { ethers } from 'ethers';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { HARDHAT_OWNER_ADDRESS, FORK_MAINNET } from '../../../constants';
import { MockToken__factory } from '../../../typechain';

const tokens = [
  'USDC',
  'DAI',
  'YFI',
  'SUSHI',
  'alUSD',
  'USDT',
  'WETH',
] as const;

type tokenType = typeof tokens[number];

const mintToken = async (
  hre: HardhatRuntimeEnvironment,
  minter: string,
  receiver: string,
  token: tokenType,
  amount: string
) => {
  const minterSigner = await hre.ethers.getSigner(minter);
  const usdc = MockToken__factory.connect(
    (await hre.deployments.get(token)).address,
    minterSigner
  );

  const bigAmount = hre.ethers.utils.parseEther(amount);

  await usdc.mint(bigAmount);
  await usdc.transfer(receiver, bigAmount);
};

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const useProxy = !hre.network.live;
  if (FORK_MAINNET) return !useProxy;

  const { deployer } = await hre.getNamedAccounts();
  const signers = await hre.ethers.getSigners();
  const receiver = HARDHAT_OWNER_ADDRESS;
  if (receiver === AddressZero) {
    throw 'HARDHAT_OWNER_ADDRESS is not set';
  }

  const tx = {
    to: receiver,
    value: ethers.utils.parseEther('10'),
  };

  await signers[0].sendTransaction(tx);

  for (const token of tokens) {
    await mintToken(hre, deployer, receiver, token, '10000');
  }

  return !useProxy;
};
export default func;
func.id = 'deploy_mock_yearn_protocol';
func.tags = ['DeployMockYearn', 'MockYearn'];
