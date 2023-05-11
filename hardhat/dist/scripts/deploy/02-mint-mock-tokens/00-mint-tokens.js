"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@ethersproject/constants");
const ethers_1 = require("ethers");
const constants_2 = require("../../../constants");
const typechain_1 = require("../../../typechain");
const tokens = [
    'USDC',
    'DAI',
    'YFI',
    'SUSHI',
    'alUSD',
    'USDT',
    'WETH',
];
const mintToken = async (hre, minter, receiver, token, amount) => {
    const minterSigner = await hre.ethers.getSigner(minter);
    const usdc = typechain_1.MockToken__factory.connect((await hre.deployments.get(token)).address, minterSigner);
    const bigAmount = hre.ethers.utils.parseEther(amount);
    await usdc.mint(bigAmount);
    await usdc.transfer(receiver, bigAmount);
};
const func = async function (hre) {
    const useProxy = !hre.network.live;
    if (constants_2.FORK_MAINNET)
        return !useProxy;
    const { deployer } = await hre.getNamedAccounts();
    const signers = await hre.ethers.getSigners();
    const receiver = constants_2.HARDHAT_OWNER_ADDRESS;
    if (receiver === constants_1.AddressZero) {
        throw 'HARDHAT_OWNER_ADDRESS is not set';
    }
    const tx = {
        to: receiver,
        value: ethers_1.ethers.utils.parseEther('10'),
    };
    await signers[0].sendTransaction(tx);
    for (const token of tokens) {
        await mintToken(hre, deployer, receiver, token, '10000');
    }
    return !useProxy;
};
exports.default = func;
func.id = 'deploy_mock_yearn_protocol';
func.tags = ['DeployMockYearn', 'MockYearn'];
