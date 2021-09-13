import { Wallet, ethers } from 'ethers';

export const getSignature = async (data: string, provider?: any) => {
  if (!provider) throw 'Missing provider for getSignature';

  function doSomething(maxExecutionTime: number) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(false), maxExecutionTime);

      (async function () {
        const signer: Wallet = provider.getSigner();
        const address = await signer.getAddress();
        const signature = await signer.signMessage(data);
        const byteCode = await provider.getCode(address);
        const isSmartContract =
          byteCode && ethers.utils.hexStripZeros(byteCode) !== '0x';
        let hash = '';
        if (isSmartContract) {
          hash = ethers.utils.hashMessage(data);
          // validate smart contract signature (might work for other other types of smart contract wallets )
          // comment out when not testing
          //_validateContractSignature(signature, hash, provider, address);
        }
        resolve({ signature, hash });
      })();
    });
  }

  const result = await doSomething(4500);
  if (result) {
    return result as any;
  } else {
    throw 'There was an error signing the message with your hardware wallet. Try sending a shorter message.';
  }
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
    const wallet = new ethers.Contract(address, contractABI, provider);
    // const iface = new ethers.utils.Interface(contractABI);
    return await wallet.isValidSignature(hashMessage, signedData);
  } catch (error) {
    console.error('_validateContractSignature', error);
  }
};
