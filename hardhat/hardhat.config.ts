import dotenv from 'dotenv';
import { ethers } from 'ethers';
import { task, HardhatUserConfig } from 'hardhat/config';
import '@typechain/hardhat';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

dotenv.config({ path: '../.env' });

const USDC_WHALE_ADDRESS = '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503';
const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

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
        // Todo: fix this
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
  url: process.env.ETHEREUM_RPC_URL ?? 'http://127.0.0.1:7545',
  blockNumber: +(process.env.FORKED_BLOCK ?? '13500000'),
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
  },
};

if (process.env.TEST) {
  // @ts-ignore
  config.networks.hardhat.forking = forking;
}

export default config;
