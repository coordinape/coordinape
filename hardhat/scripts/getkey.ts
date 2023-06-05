import { ethers } from 'ethers';

// Your mnemonic phrase (always keep this secret!)
// const mnemonic = 'test test test test test test test test test test test junk';
const mnemonic = process.env.OPTIMISM_GOERLI_MNEMONIC;

// Define your custom path
const customPath = "m/44'/60'/0'/0/0";
// Default path for ethereum is m/44'/60'/0'/0

// Create an instance of ethers.Wallet
const wallet = ethers.Wallet.fromMnemonic(mnemonic, customPath);

// Output the address
console.log('Address:', wallet.address);

// Output the private key
console.log('Private Key:', wallet.privateKey);
