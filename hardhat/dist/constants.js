"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAI_YVAULT_ADDRESS = exports.DAI_ADDRESS = exports.USDC_DECIMAL_MULTIPLIER = exports.USDC_YVAULT_ADDRESS = exports.USDC_ADDRESS = exports.USDC_WHALE_ADDRESS = exports.YEARN_REGISTRY_ADDRESS = exports.HARDHAT_OWNER_ADDRESS = exports.FORKED_BLOCK = exports.ETHEREUM_RPC_URL = exports.GANACHE_URL = exports.GANACHE_PORT = exports.GANACHE_NETWORK_NAME = exports.FORK_MAINNET = void 0;
const constants_1 = require("@ethersproject/constants");
const dotenv_1 = __importDefault(require("dotenv"));
const ethers_1 = require("ethers");
dotenv_1.default.config({ path: '../.env' });
exports.FORK_MAINNET = process.env.FORK_MAINNET || process.env.CI;
exports.GANACHE_NETWORK_NAME = 'ci';
exports.GANACHE_PORT = process.env.HARDHAT_GANACHE_PORT;
exports.GANACHE_URL = `http://127.0.0.1:${exports.GANACHE_PORT}`;
exports.ETHEREUM_RPC_URL = (_a = process.env.ETHEREUM_RPC_URL) !== null && _a !== void 0 ? _a : 'http://127.0.0.1:7545';
exports.FORKED_BLOCK = process.env.HARDHAT_FORK_BLOCK
    ? parseInt(process.env.HARDHAT_FORK_BLOCK)
    : undefined;
exports.HARDHAT_OWNER_ADDRESS = (_b = process.env.HARDHAT_OWNER_ADDRESS) !== null && _b !== void 0 ? _b : constants_1.AddressZero;
exports.YEARN_REGISTRY_ADDRESS = '0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804';
exports.USDC_WHALE_ADDRESS = '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503';
exports.USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
exports.USDC_YVAULT_ADDRESS = '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9';
exports.USDC_DECIMAL_MULTIPLIER = ethers_1.BigNumber.from('10').pow(6);
exports.DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
exports.DAI_YVAULT_ADDRESS = '0xdA816459F1AB5631232FE5e97a05BBBb94970c95';
