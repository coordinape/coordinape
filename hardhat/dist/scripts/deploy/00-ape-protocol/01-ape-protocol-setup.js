"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const hardhat_1 = require("hardhat");
const typechain_1 = require("../../../typechain");
const log = (0, debug_1.default)('coordinape:tests');
async function executeTimelockedFunction(contract, method, args) {
    log(`executing "${method}" of Contract: "${contract.address}" with (${args.join()}) arguments`);
    const ZERO = hardhat_1.ethers.utils.zeroPad([0], 32);
    const data = contract.interface.encodeFunctionData(method, args);
    await contract.schedule(contract.address, data, ZERO, ZERO, 0);
    await contract.execute(contract.address, data, ZERO, ZERO, 0);
}
const func = async function (hre) {
    const { deployer } = await hre.getNamedAccounts();
    const useProxy = !hre.network.live;
    const signer = await hardhat_1.ethers.getSigner(deployer);
    const apeRegistry = typechain_1.ApeRegistry__factory.connect((await hre.deployments.get('ApeRegistry')).address, signer);
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
exports.default = func;
func.id = 'setup_ape_protocol';
func.tags = ['SetupApe', 'Ape'];
