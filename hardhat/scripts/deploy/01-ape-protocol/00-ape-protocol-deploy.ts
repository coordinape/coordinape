/* eslint-disable no-console */
import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { FORK_MAINNET, YEARN_REGISTRY_ADDRESS } from '../../../constants';
import { CoSoul, CoSoul__factory } from '../../../typechain';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer, proxyAdmin } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const signer = await ethers.getSigner(deployer);
  const useProxy = !hre.network.live;
  let yRegistry: string;
  if (hre.network.name === 'hardhat' && !FORK_MAINNET) {
    yRegistry = (await hre.deployments.get('MockRegistry')).address;
  } else {
    yRegistry = YEARN_REGISTRY_ADDRESS;
  }
  const implementation = await deploy('ApeVaultWrapperImplementation', {
    contract: 'ApeVaultWrapperImplementation',
    from: deployer,
    args: [],
    log: true,
  });
  const vaultBeacon = await deploy('VaultBeacon', {
    contract: 'VaultBeacon',
    from: deployer,
    args: [implementation.address, 0],
    log: true,
  });
  const apeRegistry = await deploy('ApeRegistry', {
    contract: 'ApeRegistry',
    from: deployer,
    args: [deployer, 0],
    log: true,
  });
  const apeVaultFactory = await deploy('ApeVaultFactory', {
    contract: 'ApeVaultFactory',
    from: deployer,
    args: [yRegistry, apeRegistry.address, vaultBeacon.address],
    log: true,
  });
  await deploy('ApeRouter', {
    contract: 'ApeRouter',
    from: deployer,
    args: [yRegistry, apeVaultFactory.address, 0],
    log: true,
  });
  await deploy('ApeDistributor', {
    contract: 'ApeDistributor',
    from: deployer,
    args: [apeRegistry.address],
    log: true,
  });
  await deploy('FeeRegistry', {
    contract: 'FeeRegistry',
    from: deployer,
    args: [],
    log: true,
  });
  await deploy('COToken', {
    contract: 'COToken',
    from: deployer,
    args: [],
    log: true,
  });
  // const cosoul = await deploy('CoSoul', {
  //   contract: 'CoSoul',
  //   from: deployer,
  //   args: [],
  //   log: true,
  // });

  // const cosoulFac = CoSoul__factory.connect(cosoul.address, signer);

  // const proxyData = cosoulFac.interface.encodeFunctionData('initialize', [
  //   'Cosoul',
  //   'Soul',
  //   proxyAdmin,
  // ]);
  // // const proxyData = cosoul.initialize.encode(['', '', proxyAdmin]);
  // await deploy('SoulProxy', {
  //   contract: 'SoulProxy',
  //   from: deployer,
  //   args: [cosoul.address, proxyAdmin, proxyData],
  //   log: true,
  // });

  // const data = cosoulimp.interface.encodeFunctionData('initialize', [
  //   'CoSoul',
  //   'Soul',
  // ]);
  // proxyAdmin,
  //   await deploy('SoulProxy', {
  //     contract: 'SoulProxy',
  //     from: deployer,
  //     log: true,
  //     args: [cosoul.address, proxyAdmin, data],
  //   });
  return !useProxy;
};
export default func;
func.id = 'deploy_ape_protocol';
func.tags = ['DeployApe', 'Ape'];
