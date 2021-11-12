import dotenv from 'dotenv';
import { ethers } from 'ethers';
import { task, HardhatUserConfig } from 'hardhat/config';

import '@typechain/hardhat';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';

dotenv.config({ path: '../.env' });

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
    sources: './contracts',
  },
  mocha: {
    timeout: 60000,
  },
  networks: {
    hardhat: {
      live: false,
      allowUnlimitedContractSize: true,
      gas: 'auto',
      gasPrice: 'auto',
      gasMultiplier: 1,
      chainId: 1337,
      accounts: {
        mnemonic: 'coordinape',
      },
      deploy: ['./scripts/deploy'],

      forking: {
        url: process.env.ETHEREUM_RPC_URL ?? 'http://127.0.0.1:7545',
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
