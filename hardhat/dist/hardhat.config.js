"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const ethers_1 = require("ethers");
const config_1 = require("hardhat/config");
require("@typechain/hardhat");
require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
dotenv_1.default.config({ path: '../.env' });
(0, config_1.task)('accounts', 'Prints the list of accounts', async (args, hre) => {
    const accounts = await hre.ethers.getSigners();
    console.log('\nAvailable Accounts\n==================\n');
    accounts.forEach(async (account, i) => {
        const accountId = String(i).padStart(2, '0');
        const balance = await account.getBalance();
        console.log(`(${accountId}) ${account.address} (${ethers_1.ethers.utils.formatEther(balance)} ETH)`);
    });
});
const config = {
    solidity: {
        compilers: [{ version: '0.8.2', settings: {} }],
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
    paths: {
        sources: './contracts',
    },
    mocha: {
        timeout: 60000,
    },
    networks: {
        hardhat: {
            live: false,
            gas: 'auto',
            gasPrice: 'auto',
            gasMultiplier: 1,
            chainId: 1337,
            accounts: {
                mnemonic: 'coordinape',
            },
            deploy: ['./scripts/deploy'],
            forking: {
                url: (_a = process.env.ETHEREUM_RPC_URL) !== null && _a !== void 0 ? _a : 'http://127.0.0.1:7545',
            },
        },
        localhost: {
            live: false,
            gas: 'auto',
            gasPrice: 'auto',
            gasMultiplier: 1,
            url: 'http://127.0.0.1:8545',
            chainId: 1337,
            accounts: {
                mnemonic: 'coordinape',
            },
            deploy: ['./scripts/deploy'],
        },
    },
};
module.exports = config;
