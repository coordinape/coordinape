import { ethers } from 'ethers';
import { task, HardhatUserConfig } from 'hardhat/config';
import '@typechain/hardhat';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ganache';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import {
  USDC_WHALE_ADDRESS,
  USDC_ADDRESS,
  ETHEREUM_RPC_URL,
  FORKED_BLOCK,
  TEST_ENV,
} from './constants';

export async function unlockSigner(
  address: string,
  hre: HardhatRuntimeEnvironment
): Promise<ethers.Signer> {
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [address],
  });
  return hre.ethers.provider.getSigner(address);
}

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

task('mint', 'Mints the given token to specified account')
  .addParam('token', 'The token to mint')
  .addParam('receiver', 'The receiver of the minted token')
  .addParam('amount', 'The amount of tokens to mint')
  .setAction(
    async (args: { token: string; receiver: string; amount: string }, hre) => {
      // patch provider so that impersonation would work
      hre.ethers.provider = new ethers.providers.JsonRpcProvider(
        hre.ethers.provider.connection.url
      );

      const mintEth = async (receiver: string, amount: string) => {
        const signers = await hre.ethers.getSigners();

        const tx = {
          to: receiver,
          value: ethers.utils.parseEther(amount),
        };

        await signers[0].sendTransaction(tx);

        console.log(`Minted ${amount} ETH to ${receiver} successfully!`);
      };

      async function mintUsdc(receiver: string, amount: string): Promise<void> {
        await mintEth(USDC_WHALE_ADDRESS, '1');
        const usdcWhale = await unlockSigner(USDC_WHALE_ADDRESS, hre);
        const usdc = new ethers.Contract(
          USDC_ADDRESS,
          ['function transfer(address to, uint amount)'],
          usdcWhale
        );

        const usdcAmount = ethers.utils.parseUnits(amount, 'mwei');

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
    }
  );

const forking = {
  url: ETHEREUM_RPC_URL,
  blockNumber: FORKED_BLOCK,
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
    },
    localhost: {
      live: false,
      allowUnlimitedContractSize: true,
      gas: 'auto',
      gasPrice: 'auto',
      gasMultiplier: 1,
      url: 'http://127.0.0.1:8545',
      chainId: 1337,
      accounts: {
        mnemonic: 'coordinape',
      },
      timeout: 50000,
      deploy: ['./scripts/deploy'],
    },
    ganache: {
      live: false,
      allowUnlimitedContractSize: true,
      gas: 'auto',
      gasPrice: 'auto',
      gasMultiplier: 1,
      url: 'http://127.0.0.1:8545',
      chainId: 1337,
      accounts: {
        mnemonic: 'coordinape',
      },
      timeout: 50000,
      deploy: ['./scripts/deploy'],
    },
  },
};

if (TEST_ENV) {
  // @ts-ignore
  config.networks.hardhat.forking = forking;
}

export default config;
