import { ethers } from 'ethers';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { ADMIN_ADDRESS, TEST_ENV, ZERO_ADDRESS } from '../../../constants';
import { MockToken__factory } from '../../../typechain';
import { unlockSigner } from '../../../utils/unlockSigner';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const useProxy = !hre.network.live;
  if (TEST_ENV) return !useProxy;

  const signers = await hre.ethers.getSigners();
  const receiver = ADMIN_ADDRESS;
  if (receiver === ZERO_ADDRESS) {
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

  const yfi = MockToken__factory.connect(
    (await hre.deployments.get('YFI')).address,
    admin
  );

  await yfi.mint(hre.ethers.utils.parseEther('10000'));

  const sushi = MockToken__factory.connect(
    (await hre.deployments.get('SUSHI')).address,
    admin
  );

  await sushi.mint(hre.ethers.utils.parseEther('10000'));

  const alUSD = MockToken__factory.connect(
    (await hre.deployments.get('alUSD')).address,
    admin
  );

  await alUSD.mint(hre.ethers.utils.parseEther('10000'));

  const usdt = MockToken__factory.connect(
    (await hre.deployments.get('USDT')).address,
    admin
  );

  await usdt.mint(hre.ethers.utils.parseEther('10000'));

  const weth = MockToken__factory.connect(
    (await hre.deployments.get('WETH')).address,
    admin
  );

  await weth.mint(hre.ethers.utils.parseEther('10000'));

  return !useProxy;
};
export default func;
func.id = 'deploy_mock_yearn_protocol';
func.tags = ['DeployMockYearn', 'MockYearn'];
