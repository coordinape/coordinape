"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const config_1 = require("hardhat/config");
require("@typechain/hardhat");
require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
const constants_1 = require("./constants");
const unlockSigner_1 = require("./utils/unlockSigner");
(0, config_1.task)('accounts', 'Prints the list of accounts', async (args, hre) => {
    const accounts = await hre.ethers.getSigners();
    console.log('\nAvailable Accounts\n==================\n');
    accounts.forEach(async (account, i) => {
        const accountId = String(i).padStart(2, '0');
        const balance = await account.getBalance();
        console.log(`(${accountId}) ${account.address} (${ethers_1.ethers.utils.formatEther(balance)} ETH)`);
    });
});
// FIXME: DRY
const tokens = {
    DAI: {
        addr: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        whale: '0x8d6f396d210d385033b348bcae9e4f9ea4e045bd',
    },
    USDC: {
        addr: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        whale: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503',
    },
};
(0, config_1.task)('mine', 'Mine a block').setAction(async (_, hre) => {
    await hre.network.provider.request({
        method: 'evm_mine',
        params: [1],
    });
    console.log(await hre.ethers.provider.getBlockNumber());
});
(0, config_1.task)('balance', 'Show token balance')
    .addParam('token', 'The token symbol')
    .addParam('address', 'The address to check')
    .setAction(async (args, hre) => {
    const contract = new ethers_1.ethers.Contract(tokens[args.token].addr, [
        'function balanceOf(address) view returns (uint256)',
        'function decimals() view returns (uint8)',
    ], hre.ethers.provider);
    const decimals = await contract.decimals();
    console.log((await contract.balanceOf(args.address))
        .div(ethers_1.BigNumber.from(10).pow(decimals))
        .toNumber());
});
(0, config_1.task)('mint', 'Mints the given token to specified account')
    .addParam('token', 'The token symbol')
    .addParam('address', 'The recipient', constants_1.HARDHAT_OWNER_ADDRESS)
    .addParam('amount', 'The amount to mint')
    .setAction(async (args, hre) => {
    console.log('derpazoid');
    const mintEth = async (receiver, amount) => {
        const signers = await hre.ethers.getSigners();
        await signers[0].sendTransaction({
            to: receiver,
            value: ethers_1.ethers.utils.parseEther(amount),
        });
        console.log(`Sent ${amount} ETH to ${receiver}`);
    };
    const mintToken = async (symbol, receiver, amount) => {
        const { whale, addr } = tokens[symbol];
        await mintEth(whale, '0.1');
        const sender = await (0, unlockSigner_1.unlockSigner)(whale, hre);
        const contract = new ethers_1.ethers.Contract(addr, [
            'function transfer(address,uint)',
            'function decimals() view returns (uint8)',
        ], sender);
        const decimals = await contract.decimals();
        const wei = ethers_1.BigNumber.from(10).pow(decimals).mul(amount);
        await contract.transfer(receiver, wei);
        console.log(`Sent ${amount} ${symbol} to ${receiver}`);
    };
    switch (args.token) {
        case 'USDC':
        case 'DAI':
            await mintToken(args.token, args.address, args.amount);
            break;
        case 'ETH':
            await mintEth(args.address, args.amount);
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
        mnemonic: 'test test test test test test test test test test test junk',
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
        [constants_1.GANACHE_NETWORK_NAME]: {
            ...sharedNetworkSettings,
            chainId: +(process.env.HARDHAT_GANACHE_CHAIN_ID || 1338),
            url: constants_1.GANACHE_URL,
        },
    },
};
exports.default = config;
