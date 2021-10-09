import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';

export const getSignature = async (data: string, provider?: Web3Provider) => {
  if (!provider) throw 'Missing provider for getSignature';

  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const signature = await new Promise<string>((resolve, reject) => {
    const t = setTimeout(
      () => reject('Waiting for signature, timed out.'),
      60000
    );
    signer
      .signMessage(data)
      .then((sig) => {
        clearTimeout(t);
        resolve(sig);
      })
      .catch((e) => {
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
