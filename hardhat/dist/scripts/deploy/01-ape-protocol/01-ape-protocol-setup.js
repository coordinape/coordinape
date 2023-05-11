"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const hardhat_1 = require("hardhat");
const typechain_1 = require("../../../typechain");
const log = (0, debug_1.default)('coordinape:setup');
async function executeTimelockedFunction(contract, method, args) {
    log(`executing "${method}" of Contract: "${contract.address}" with (${args.join()}) arguments`);
    const ZERO = hardhat_1.ethers.utils.zeroPad([0], 32);
    // @ts-ignore
    const data = contract.interface.encodeFunctionData(method, args);
    try {
        await contract.schedule(contract.address, data, ZERO, ZERO, 0);
        await contract.execute(contract.address, data, ZERO, ZERO, 0);
    }
    catch (e) {
        if (e && e.message.includes('revert TimeLock: Call already scheduled'))
            return;
        console.error(JSON.stringify(e));
        throw e;
    }
}
async function setFeeRegistry(apeRegistry, apeFeeAddress) {
    if ((await apeRegistry.feeRegistry()) === apeFeeAddress) {
        log('skipping setFeeRegistry on apeRegistry since contract already have correct data');
        return;
    }
    await executeTimelockedFunction(apeRegistry, 'setFeeRegistry', [
        apeFeeAddress,
    ]);
}
async function setTreasury(apeRegistry, treasuryAddress) {
    if ((await apeRegistry.treasury()) === treasuryAddress) {
        log('skipping setTreasury on apeRegistry since contract already have correct data');
        return;
    }
    await executeTimelockedFunction(apeRegistry, 'setTreasury', [
        treasuryAddress,
    ]);
}
async function setRouter(apeRegistry, routerAddress) {
    if ((await apeRegistry.router()) === routerAddress) {
        log('skipping setRouter on apeRegistry since contract already have correct data');
        return;
    }
    await executeTimelockedFunction(apeRegistry, 'setRouter', [routerAddress]);
}
async function setDistributor(apeRegistry, distributorAddress) {
    if ((await apeRegistry.distributor()) === distributorAddress) {
        log('skipping setDistributor on apeRegistry since contract already have correct data');
        return;
    }
    await executeTimelockedFunction(apeRegistry, 'setDistributor', [
        distributorAddress,
    ]);
}
async function setFactory(apeRegistry, factoryAddress) {
    if ((await apeRegistry.factory()) === factoryAddress) {
        log('skipping setFactory on apeRegistry since contract already have correct data');
        return;
    }
    await executeTimelockedFunction(apeRegistry, 'setFactory', [factoryAddress]);
}
const func = async function (hre) {
    const { deployer } = await hre.getNamedAccounts();
    const useProxy = !hre.network.live;
    const signer = await hardhat_1.ethers.getSigner(deployer);
    const [treasury] = await hardhat_1.ethers.getSigners();
    const apeRegistry = typechain_1.ApeRegistry__factory.connect((await hre.deployments.get('ApeRegistry')).address, signer);
    const apeFee = await hre.deployments.get('FeeRegistry');
    const apeRouter = await hre.deployments.get('ApeRouter');
    const apeDistributor = await hre.deployments.get('ApeDistributor');
    const apeVaultFactory = await hre.deployments.get('ApeVaultFactory');
    await setFeeRegistry(apeRegistry, apeFee.address);
    await setTreasury(apeRegistry, treasury.address);
    await setRouter(apeRegistry, apeRouter.address);
    await setDistributor(apeRegistry, apeDistributor.address);
    await setFactory(apeRegistry, apeVaultFactory.address);
    return !useProxy;
};
exports.default = func;
func.id = 'setup_ape_protocol';
func.tags = ['SetupApe', 'Ape'];
