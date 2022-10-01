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
  HARDHAT_OWNER_ADDRESS,
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
  SHIB: {
    addr: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
    whale: '0xdead000000000000000042069420694206942069',
  },
  WETH: {
    addr: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    whale: '0x06601571AA9D3E8f5f7CDd5b993192618964bAB5',
  },
};

task('mine', 'Mine a block').setAction(async (_, hre) => {
  await hre.network.provider.request({
    method: 'evm_mine',
    params: [1],
  });
  console.log(await hre.ethers.provider.getBlockNumber());
});

task('balance', 'Show token balance')
  .addParam('token', 'The token symbol')
  .addParam('address', 'The address to check')
  .setAction(async (args: { token: 'USDC' | 'DAI'; address: string }, hre) => {
    const contract = new ethers.Contract(
      tokens[args.token].addr,
      [
        'function balanceOf(address) view returns (uint256)',
        'function decimals() view returns (uint8)',
      ],
      hre.ethers.provider
    );
    const decimals = await contract.decimals();
    console.log(
      (await contract.balanceOf(args.address))
        .div(BigNumber.from(10).pow(decimals))
        .toNumber()
    );
  });

task('mint', 'Mints the given token to specified account')
  .addParam('token', 'The token symbol')
  .addParam('address', 'The recipient', HARDHAT_OWNER_ADDRESS)
  .addParam('amount', 'The amount to mint')
  .setAction(
    async (args: { token: string; address: string; amount: string }, hre) => {
      const mintEth = async (receiver: string, amount: string) => {
        const signers = await hre.ethers.getSigners();
        await signers[0].sendTransaction({
          to: receiver,
          value: ethers.utils.parseEther(amount),
        });
        console.log(`Sent ${amount} ETH to ${receiver}`);
      };

      const mintWeth = async(
        receiver: string, amount: string
      ) => {
        await mintEth(receiver, (Number(amount)+ 0.1).toString());
        const sender = await unlockSigner(receiver, hre);
        const weth = new ethers.Contract(
            tokens.WETH.addr,
            [
              'function deposit() public payable',
            ],
            sender
        );
        await weth.deposit({ value: ethers.utils.parseEther(amount)});
        console.log(`Sent ${amount} WETH to ${receiver}`);
      }

      const mintToken = async (
        symbol: string,
        receiver: string,
        amount: string
      ) => {
        const { whale, addr } = tokens[symbol as keyof typeof tokens];
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
        case 'ETH':
          await mintEth(args.address, args.amount);
          break;
        case 'WETH':
          await mintWeth(args.address, args.amount);
          break;
        default:
          try {
            await mintToken(args.token, args.address, args.amount);
          } catch (err) {
            console.error(`Couldn't mint ${args.token}: ${err}`);
            process.exit(1);
          }
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
    mnemonic: 'test test test test test test test test test test test junk',
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
