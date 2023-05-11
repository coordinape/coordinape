"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const constants_1 = require("../../../constants");
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
const tokensInfo = {
    USDC: {
        name: 'USD Coin',
        symbol: 'USDC',
    },
    DAI: {
        name: 'Dai StableCoin',
        symbol: 'DAI',
    },
    YFI: {
        name: 'yearn.finance',
        symbol: 'YFI',
    },
    SUSHI: {
        name: 'SushiToken',
        symbol: 'SUSHI',
    },
    alUSD: {
        name: 'alUSD',
        symbol: 'alUSD',
    },
    USDT: {
        name: 'Tether USD',
        symbol: 'USDT',
    },
    WETH: {
        name: 'Wrapped Ether',
        symbol: 'WETH',
    },
};
const deployYVault = async (hre, yRegistry, tokenType, deployer) => {
    const { deploy } = hre.deployments;
    const token = await deploy(tokenType, {
        contract: 'MockToken',
        from: deployer,
        args: [tokensInfo[tokenType].name, tokensInfo[tokenType].symbol],
        log: true,
    });
    const yvTokenName = `${tokensInfo[tokenType].symbol} yVault`;
    const yvTokenSymbol = `yv${tokensInfo[tokenType].symbol}`;
    // Note: We aren't using the MockVaultFactory.createVault() method here because
    // deploymentInfo won't track any transactions that create new contracts.
    // So, we are manually deploying the Vault and registering it with the MockRegistry.
    const yvToken = await deploy(yvTokenSymbol, {
        contract: 'MockVault',
        from: deployer,
        args: [token.address, yvTokenName, yvTokenSymbol],
    });
    await yRegistry.addVault(token.address, yvToken.address);
};
const func = async function (hre) {
    const useProxy = !hre.network.live;
    if (constants_1.FORK_MAINNET)
        return !useProxy;
    const { deployer } = await hre.getNamedAccounts();
    const signer = await hardhat_1.ethers.getSigner(deployer);
    const yRegistry = typechain_1.MockRegistry__factory.connect((await hre.deployments.get('MockRegistry')).address, signer);
    for (const token of tokens) {
        await deployYVault(hre, yRegistry, token, deployer);
    }
    return !useProxy;
};
exports.default = func;
func.id = 'deploy_mock_yvault';
func.tags = ['DeployMockYVault', 'MockYVault'];
