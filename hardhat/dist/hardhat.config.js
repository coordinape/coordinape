"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlockSigner = void 0;
const ethers_1 = require("ethers");
const config_1 = require("hardhat/config");
require("@typechain/hardhat");
require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
const constants_1 = require("./constants");
async function unlockSigner(address, hre) {
    await hre.network.provider.request({
        method: 'hardhat_impersonateAccount',
        params: [address],
    });
    return hre.ethers.provider.getSigner(address);
}
exports.unlockSigner = unlockSigner;
(0, config_1.task)('accounts', 'Prints the list of accounts', async (args, hre) => {
    const accounts = await hre.ethers.getSigners();
    console.log('\nAvailable Accounts\n==================\n');
    accounts.forEach(async (account, i) => {
        const accountId = String(i).padStart(2, '0');
        const balance = await account.getBalance();
        console.log(`(${accountId}) ${account.address} (${ethers_1.ethers.utils.formatEther(balance)} ETH)`);
    });
});
(0, config_1.task)('mint', 'Mints the given token to specified account')
    .addParam('token', 'The token to mint')
    .addParam('receiver', 'The receiver of the minted token')
    .addParam('amount', 'The amount of tokens to mint')
    .setAction(async (args, hre) => {
    // patch provider so that impersonation would work
    hre.ethers.provider = new ethers_1.ethers.providers.JsonRpcProvider(hre.ethers.provider.connection.url);
    const mintEth = async (receiver, amount) => {
        const signers = await hre.ethers.getSigners();
        const tx = {
            to: receiver,
            value: ethers_1.ethers.utils.parseEther(amount),
        };
        await signers[0].sendTransaction(tx);
        console.log(`Minted ${amount} ETH to ${receiver} successfully!`);
    };
    async function mintUsdc(receiver, amount) {
        await mintEth(constants_1.USDC_WHALE_ADDRESS, '1');
        const usdcWhale = await unlockSigner(constants_1.USDC_WHALE_ADDRESS, hre);
        const usdc = new ethers_1.ethers.Contract(constants_1.USDC_ADDRESS, ['function transfer(address to, uint amount)'], usdcWhale);
        const usdcAmount = ethers_1.ethers.utils.parseUnits(amount, 'mwei');
        await usdc.transfer(receiver, usdcAmount);
        console.log(`Minted ${amount} USDC to ${receiver} successfully!`);
    }
    switch (args.token) {
        case 'USDC':
            await mintUsdc(args.receiver, args.amount);
            break;
        case 'ETH':
            await mintEth(args.receiver, args.amount);
            break;
        default:
            console.error(`Unknown token name: ${args.token}`);
            process.exit(1);
    }
});
const sharedNetworkSettings = {
    live: false,
    allowUnlimitedContractSize: true,
    gas: 'auto',
    gasPrice: 'auto',
    gasMultiplier: 1,
    accounts: {
        mnemonic: 'coordinape',
    },
    deploy: ['./scripts/deploy'],
};
const config = {
    solidity: {
        compilers: [
            {
                version: '0.8.2',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 1,
                    },
                },
            },
        ],
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
    paths: {
        sources: './contracts/coordinape-protocol/contracts/ApeProtocol',
    },
    mocha: {
        timeout: 60000,
    },
    networks: {
        hardhat: {
            ...sharedNetworkSettings,
            chainId: +(process.env.HARDHAT_CHAIN_ID || 1337),
            forking: constants_1.FORK_MAINNET
                ? {
                    url: constants_1.ETHEREUM_RPC_URL,
                    blockNumber: constants_1.FORKED_BLOCK,
                }
                : undefined,
        },
        ci: {
            ...sharedNetworkSettings,
            chainId: +(process.env.HARDHAT_GANACHE_CHAIN_ID || 1338),
            url: constants_1.GANACHE_URL,
        },
    },
};
exports.default = config;
