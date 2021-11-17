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

module.exports = {
  solidity: '0.8.2',
  networks: {
    hardhat: {blockGasLimit: 200000000, chainId: 1337}
  }
};
