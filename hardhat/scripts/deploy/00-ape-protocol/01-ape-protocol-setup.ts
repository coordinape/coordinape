import { Contract } from '@ethersproject/contracts';
import debug from 'debug';
import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { ApeRegistry__factory } from '../../../typechain';

const log = debug('coordinape:tests');

async function executeTimelockedFunction(
  contract: Contract,
  method: string,
  args: Array<unknown>
) {
  log(
    `executing "${method}" of Contract: "${
      contract.address
    }" with (${args.join()}) arguments`
  );
  const ZERO = ethers.utils.zeroPad([0], 32);
  const data = contract.interface.encodeFunctionData(method, args);
  await contract.schedule(contract.address, data, ZERO, ZERO, 0);
  await contract.execute(contract.address, data, ZERO, ZERO, 0);
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
  const apeVaultFactory = await hre.deployments.get('ApeVaultFactory');

  await executeTimelockedFunction(apeRegistry, 'setFeeRegistry', [
    apeFee.address,
  ]);

  await executeTimelockedFunction(apeRegistry, 'setRouter', [
    apeRouter.address,
  ]);

  await executeTimelockedFunction(apeRegistry, 'setDistributor', [
    apeDistributor.address,
  ]);

  await executeTimelockedFunction(apeRegistry, 'setFactory', [
    apeVaultFactory.address,
  ]);

  return !useProxy;
};
export default func;
func.id = 'setup_ape_protocol';
func.tags = ['SetupApe', 'Ape'];
