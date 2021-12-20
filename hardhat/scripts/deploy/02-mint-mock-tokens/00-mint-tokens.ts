import { log } from 'debug';
import { ethers } from 'ethers';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { MockToken__factory } from '../../../typechain';
import { unlockSigner } from '../../../utils/unlockSigner';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const signers = await hre.ethers.getSigners();
  const useProxy = !hre.network.live;

  const receiver = process.env.ADMIN_ADDRESS;
  if (process.env.TEST) return !useProxy;
  if (!receiver) {
    throw new Error('Error: ADMIN_ADDRESS is not set!');
  }

  const tx = {
    to: receiver,
    value: ethers.utils.parseEther('10'),
  };

  await signers[0].sendTransaction(tx);

  const admin = await unlockSigner(receiver);

  const usdc = MockToken__factory.connect(
    (await hre.deployments.get('USDC')).address,
    admin
  );

  await usdc.mint(hre.ethers.utils.parseEther('10000'));

  const dai = MockToken__factory.connect(
    (await hre.deployments.get('DAI')).address,
    admin
  );

  await dai.mint(hre.ethers.utils.parseEther('10000'));

  return !useProxy;
};
export default func;
func.id = 'deploy_mock_yearn_protocol';
func.tags = ['DeployMockYearn', 'MockYearn'];
