import { http, HDAccount, PrivateKeyAccount, createWalletClient } from 'viem';
import { mnemonicToAccount } from 'viem/accounts';
import { localhost } from 'viem/chains';

import { HARDHAT_GANACHE_PORT } from '../../config/env';

const MNEMONIC = 'test test test test test test test test test test test junk';
const BASE_HD_PATH = "m/44'/60'/0'/0/";

export class TestAccountManager {
  private accounts: (HDAccount | PrivateKeyAccount)[] = [];

  constructor(numberOfAccounts: number = 10) {
    // Generate HD accounts
    for (let i = 0; i < numberOfAccounts; i++) {
      this.accounts.push(
        mnemonicToAccount(MNEMONIC, {
          path: `${BASE_HD_PATH}${i}`,
        })
      );
    }
  }

  getAccount(index: number): HDAccount | PrivateKeyAccount {
    if (index < 0 || index >= this.accounts.length) {
      throw new Error(`Account index ${index} is out of range`);
    }
    return this.accounts[index];
  }

  getWalletClient(accountIndex: number) {
    const account = this.getAccount(accountIndex);
    return createWalletClient({
      account,
      chain: localhost,
      transport: http(`http://localhost:${HARDHAT_GANACHE_PORT}`),
    });
  }

  getAllAccounts() {
    return this.accounts;
  }
}

export const testAccounts = new TestAccountManager();
