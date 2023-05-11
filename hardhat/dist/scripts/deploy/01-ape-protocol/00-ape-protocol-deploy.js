"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../constants");
const func = async function (hre) {
    const { deployer } = await hre.getNamedAccounts();
    const { deploy } = hre.deployments;
    const useProxy = !hre.network.live;
    let yRegistry;
    if (hre.network.name === 'hardhat' && !constants_1.FORK_MAINNET) {
        yRegistry = (await hre.deployments.get('MockRegistry')).address;
    }
    else {
        yRegistry = constants_1.YEARN_REGISTRY_ADDRESS;
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
    return !useProxy;
};
exports.default = func;
func.id = 'deploy_ape_protocol';
func.tags = ['DeployApe', 'Ape'];
