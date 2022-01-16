import debug from 'debug';
import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { ZERO_ADDRESS } from '../../../constants';
import { ApeRegistry, ApeRegistry__factory } from '../../../typechain';

const log = debug('coordinape:setup');

async function executeTimelockedFunction(
  contract: ApeRegistry,
  method: string,
  args: Array<unknown>
) {
  log(
    `executing "${method}" of Contract: "${
      contract.address
    }" with (${args.join()}) arguments`
  );
  const ZERO = ethers.utils.zeroPad([0], 32);
  // @ts-ignore
  const data = contract.interface.encodeFunctionData(method, args);
  try {
    await contract.schedule(contract.address, data, ZERO, ZERO, 0);
    await contract.execute(contract.address, data, ZERO, ZERO, 0);
  } catch (e: any) {
    if (e && e.message.includes('revert TimeLock: Call already scheduled'))
      return;
    console.error(JSON.stringify(e));
    throw e;
  }
}

async function setFeeRegistry(
  apeRegistry: ApeRegistry,
  apeFeeAddress: string
): Promise<void> {
  if ((await apeRegistry.feeRegistry()) === apeFeeAddress) {
    log(
      'skipping setFeeRegistry on apeRegistry since contract already have correct data'
    );
    return;
  }
  await executeTimelockedFunction(apeRegistry, 'setFeeRegistry', [
    apeFeeAddress,
  ]);
}

async function setTreasury(
  apeRegistry: ApeRegistry,
  treasuryAddress: string
): Promise<void> {
  if ((await apeRegistry.treasury()) === treasuryAddress) {
    log(
      'skipping setTreasury on apeRegistry since contract already have correct data'
    );
    return;
  }
  await executeTimelockedFunction(apeRegistry, 'setTreasury', [
    treasuryAddress,
  ]);
}

async function setRouter(
  apeRegistry: ApeRegistry,
  routerAddress: string
): Promise<void> {
  if ((await apeRegistry.router()) === routerAddress) {
    log(
      'skipping setRouter on apeRegistry since contract already have correct data'
    );
    return;
  }
  await executeTimelockedFunction(apeRegistry, 'setRouter', [routerAddress]);
}

async function setDistributor(
  apeRegistry: ApeRegistry,
  distributorAddress: string
): Promise<void> {
  if ((await apeRegistry.distributor()) === distributorAddress) {
    log(
      'skipping setDistributor on apeRegistry since contract already have correct data'
    );
    return;
  }
  await executeTimelockedFunction(apeRegistry, 'setDistributor', [
    distributorAddress,
  ]);
}

async function setFactory(
  apeRegistry: ApeRegistry,
  factoryAddress: string
): Promise<void> {
  if ((await apeRegistry.factory()) === factoryAddress) {
    log(
      'skipping setFactory on apeRegistry since contract already have correct data'
    );
    return;
  }
  await executeTimelockedFunction(apeRegistry, 'setFactory', [factoryAddress]);
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const useProxy = !hre.network.live;
  const signer = await ethers.getSigner(deployer);

  const apeRegistry = ApeRegistry__factory.connect(
    (await hre.deployments.get('ApeRegistry')).address,
    signer
  );

  const apeFee = await hre.deployments.get('FeeRegistry');
  const apeRouter = await hre.deployments.get('ApeRouter');
  const apeDistributor = await hre.deployments.get('ApeDistributor');
  const apeVaultFactory = await hre.deployments.get('ApeVaultFactoryBeacon');

  await setFeeRegistry(apeRegistry, apeFee.address);
  await setTreasury(apeRegistry, ZERO_ADDRESS);
  await setRouter(apeRegistry, apeRouter.address);
  await setDistributor(apeRegistry, apeDistributor.address);
  await setFactory(apeRegistry, apeVaultFactory.address);

  return !useProxy;
};
export default func;
func.id = 'setup_ape_protocol';
func.tags = ['SetupApe', 'Ape'];
