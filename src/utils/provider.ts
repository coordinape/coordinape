import type { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import _ from 'lodash';

import { chain } from '../features/cosoul/chains';

export const getSignature = async (
  data: string,
  provider?: Web3Provider,
  timeout = true
) => {
  if (!provider) throw 'Missing provider for getSignature';

  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const signature = await new Promise<string>((resolve, reject) => {
    const t =
      timeout &&
      setTimeout(() => reject('Waiting for signature, timed out.'), 60000);
    signer
      .signMessage(data)
      .then(sig => {
        if (t) clearTimeout(t);
        resolve(sig);
      })
      .catch(e => {
        // if (e.code === 'CODE_FOR_HARDWAREWALLET_ERROR') {
        //   e.message = 'There was an error signing the message with your hardware wallet. Try sending a shorter message.';
        // }
        reject(e);
      });
  });

  const byteCode = await provider.getCode(address);
  const isSmartContract =
    !!byteCode && ethers.utils.hexStripZeros(byteCode) !== '0x';
  const hash = isSmartContract ? ethers.utils.hashMessage(data) : '';

  // validate smart contract signature (might work for other other types of smart contract wallets )
  // comment out when not testing
  //_validateContractSignature(signature, hash, provider, address);

  return { signature, hash };
};

export const _validateContractSignature = async (
  signedData: string,
  hashMessage: string,
  provider: Web3Provider,
  address: string
) => {
  try {
    const contractABI = [
      'function isValidSignature(bytes32 _message, bytes _signature) public view returns (bool)',
    ];
    const wallet = new ethers.Contract(address, contractABI, provider);
    // const iface = new ethers.utils.Interface(contractABI);
    return await wallet.isValidSignature(hashMessage, signedData);
  } catch (error) {
    console.error('_validateContractSignature', error);
  }
};

export function makeExplorerUrl(
  chainId: number,
  txHash: string | undefined,
  dir = 'tx'
) {
  if (!txHash) return;
  switch (chainId) {
    case 1:
      return `https://etherscan.io/${dir}/${txHash}`;
    case 4:
      return `https://rinkeby.etherscan.io/${dir}/${txHash}`;
    case 5:
      return `https://goerli.etherscan.io/${dir}/${txHash}`;
    case 1337:
    case 1338:
      // provide a dead link for rendering purposes in dev
      return '#' + txHash;
    default:
      console.warn(`No explorer for chain ID ${chainId}; tx Hash: ` + txHash);
  }
}

export async function switchNetwork(
  targetChainId: string,
  onError?: (e: Error | any) => void
): Promise<void> {
  const ethereum = (window as any).ethereum;
  if (!ethereum) {
    return;
  }
  // convert decimal string to hex
  const targetChainIdHex = '0x' + parseInt(targetChainId).toString(16);

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: targetChainIdHex }],
    });
    // refresh
    (window as any).location.reload();
  } catch (error: Error | any) {
    onError && onError(error);
  }
}

export const addEthereumChain = async (library: any) => {
  // add and/or switch to the proper chain
  await library.send('wallet_addEthereumChain', [
    // use chain options without 'gasSettings' key
    _.omit(chain, 'gasSettings'),
  ]);
};

export async function switchOrAddNetwork(
  library: any,
  onError?: (e: Error | any) => void
): Promise<void> {
  try {
    const targetChainIdHex = chain.chainId;
    await library.provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: targetChainIdHex }],
    });
  } catch (switchError: any) {
    console.error('switchError', switchError);
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError?.code === 4902) {
      try {
        await addEthereumChain(library);
      } catch (error: Error | any) {
        console.error('Failed to add chain', error);
        onError && onError(error);
      }
    } else {
      onError && onError(switchError);
    }
  }
}
