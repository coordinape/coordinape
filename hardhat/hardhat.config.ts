/* eslint-disable no-console */

import { BigNumber, ethers } from 'ethers';
import { task, HardhatUserConfig } from 'hardhat/config';
import '@typechain/hardhat';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';

import {
  ETHEREUM_RPC_URL,
  FORKED_BLOCK,
  FORK_MAINNET,
  GANACHE_NETWORK_NAME,
  GANACHE_URL,
} from './constants';
import { unlockSigner } from './utils/unlockSigner';

task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  console.log('\nAvailable Accounts\n==================\n');
  accounts.forEach(async (account, i) => {
    const accountId = String(i).padStart(2, '0');
    const balance = await account.getBalance();
    console.log(
      `(${accountId}) ${account.address} (${ethers.utils.formatEther(
        balance
      )} ETH)`
    );
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

task('mint', 'Mints the given token to specified account')
  .addParam('token', 'The token to mint')
  .addParam('receiver', 'The receiver of the minted token')
  .addParam('amount', 'The amount of tokens to mint')
  .setAction(
    async (args: { token: string; receiver: string; amount: string }, hre) => {
      const mintEth = async (receiver: string, amount: string) => {
        const signers = await hre.ethers.getSigners();
        await signers[0].sendTransaction({
          to: receiver,
          value: ethers.utils.parseEther(amount),
        });
        console.log(`Sent ${amount} ETH to ${receiver}`);
      };

      const mintToken = async (
        symbol: 'USDC' | 'DAI',
        receiver: string,
        amount: string
      ) => {
        const { whale, addr } = tokens[symbol];
        await mintEth(whale, '0.1');
        const sender = await unlockSigner(whale, hre);
        const contract = new ethers.Contract(
          addr,
          [
            'function transfer(address,uint)',
            'function decimals() view returns (uint8)',
          ],
          sender
        );
        const decimals = await contract.decimals();
        const wei = BigNumber.from(10).pow(decimals).mul(amount);
        await contract.transfer(receiver, wei);
        console.log(`Sent ${amount} ${symbol} to ${receiver}`);
      };

      switch (args.token) {
        case 'USDC':
        case 'DAI':
          await mintToken(args.token, args.receiver, args.amount);
          break;
        case 'ETH':
          await mintEth(args.receiver, args.amount);
          break;
        default:
          console.error(`Unknown token name: ${args.token}`);
          process.exit(1);
      }
    }
  );

const sharedNetworkSettings = {
  live: false,
  allowUnlimitedContractSize: true,
  gas: 'auto' as const,
  gasPrice: 'auto' as const,
  gasMultiplier: 1,
  accounts: {
    mnemonic: 'coordinape',
  },
  deploy: ['./scripts/deploy'],
};

const config: HardhatUserConfig = {
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
      forking: FORK_MAINNET
        ? {
            url: ETHEREUM_RPC_URL,
            blockNumber: FORKED_BLOCK,
          }
        : undefined,
    },
    [GANACHE_NETWORK_NAME]: {
      ...sharedNetworkSettings,
      chainId: +(process.env.HARDHAT_GANACHE_CHAIN_ID || 1338),
      url: GANACHE_URL,
    },
  },
};

export default config;
