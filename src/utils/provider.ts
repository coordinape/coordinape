import { Wallet, ethers } from 'ethers';

export const getSignature = async (
  data: string,
  provider?: any
): Promise<any> => {
  if (!provider)
    return new Promise((resolve) => {
      resolve('');
    });
  const signer: Wallet = provider.getSigner();
  const address = await signer.getAddress();
  const signature = await signer.signMessage(data);
  const bytecode = await provider.getCode(address);
  const isSmartContract =
    bytecode && ethers.utils.hexStripZeros(bytecode) !== '0x';
  let hash = '';
  if (isSmartContract) {
    hash = ethers.utils.hashMessage(data);
    // validate smart contract signature (might work for other other types of smart contract wallets )
    // comment out when not testing
    //_validateContractSignature(signature, hash, provider, address);
  }
  return { signature, hash };
};

export const _validateContractSignature = async (
  signedData: string,
  hashMessage: string,
  provider: any,
  address: string
) => {
  try {
    const contractABI = [
      'function isValidSignature(bytes32 _message, bytes _signature) public view returns (bool)',
    ];
    console.log('hashMessage', hashMessage);
    console.log('signedData', signedData);
    const wallet = new ethers.Contract(address, contractABI, provider);
    const iface = new ethers.utils.Interface(contractABI);
    // eslint-disable-next-line no-console
    console.log(
      'iface',
      iface.encodeFunctionData('isValidSignature', [hashMessage, signedData])
    );
    const returnValue = await wallet.isValidSignature(hashMessage, signedData);
    console.log('valid', returnValue);
  } catch (error) {
    console.log('not valid', error);
  }
};
