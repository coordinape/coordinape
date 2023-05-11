"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../constants");
const func = async function (hre) {
    const useProxy = !hre.network.live;
    if (constants_1.FORK_MAINNET)
        return !useProxy;
    const { deployer } = await hre.getNamedAccounts();
    const { deploy } = hre.deployments;
    const yRegistry = await deploy('MockRegistry', {
        contract: 'MockRegistry',
        from: deployer,
        args: [],
        log: true,
    });
    await deploy('MockVaultFactory', {
        contract: 'MockVaultFactory',
        from: deployer,
        args: [yRegistry.address],
        log: true,
    });
    return !useProxy;
};
exports.default = func;
func.id = 'deploy_mock_yearn_protocol';
func.tags = ['DeployMockYearn', 'MockYearn'];
