import type { VercelRequest } from '@vercel/node';
import {
  bufferToHex,
  fromRpcSig,
  fromAscii,
  ecrecover,
  hashPersonalMessage,
  toBuffer,
  pubToAddress,
} from 'ethereumjs-util';
import { ethers } from 'ethers';

import { composeCrossClientAuthRequestBody, loginInput } from '../src/lib/zod';

import { INFURA_PROJECT_ID } from './config';
import { errorLog } from './HttpError';

export function parseInput(req: VercelRequest) {
  const {
    input: { payload: input },
  } = composeCrossClientAuthRequestBody(loginInput).parse(req.body);

  return input;
}

export type SignatureInput = ReturnType<typeof parseInput>;

const provider = new ethers.providers.InfuraProvider(
  'homestead',
  INFURA_PROJECT_ID
);

const eip1271WorkingAbi = [
  {
    constant: true,
    inputs: [
      // legacy (working spec) interface
      {
        name: '_messageHash',
        type: 'bytes',
      },
      {
        name: '_signature',
        type: 'bytes',
      },
    ],
    name: 'isValidSignature',
    outputs: [
      // returns 0x20c13b0b on success
      {
        name: 'magicValue',
        type: 'bytes4',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];
const eip1271FinalAbi = [
  // finalized interface
  // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1271.md
  {
    constant: true,
    inputs: [
      {
        name: '_messageHash',
        type: 'bytes32',
      },
      {
        name: '_signature',
        type: 'bytes',
      },
    ],
    name: 'isValidSignature',
    outputs: [
      // returns 0x1626ba7e on success
      {
        name: 'magicValue',
        type: 'bytes4',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

export async function verifyContractSignature(input: SignatureInput) {
  const { address, hash, signature } = input;
  try {
    const magicValue = '0x20c13b0b';
    const instance = new ethers.Contract(address, eip1271WorkingAbi, provider);
    const result = await instance.isValidSignature(hash, signature);
    // Logging this for informational purposes in case this branch is never
    // actually used anymore.
    errorLog('Legacy validation resolved');
    return result === magicValue;
  } catch (e) {
    errorLog(
      'error authenticating Contract Legacy Signature: ' +
        e +
        '\nTrying Final Spec'
    );
    const magicValue = '0x1626ba7e';
    const instance = new ethers.Contract(address, eip1271FinalAbi, provider);
    const result = await instance.isValidSignature(hash, signature);
    return result === magicValue;
  }
}

export function verifySignature(input: SignatureInput) {
  const { data, signature, address } = input;
  // generate the message hash and split out the r, s, v params
  const msgHash = hashPersonalMessage(toBuffer(fromAscii(data)));

  const sig = fromRpcSig(signature);
  // pass all data into ecrecover and verify the returned address matches
  // the provided address.
  const signerAddress = bufferToHex(
    pubToAddress(ecrecover(msgHash, sig.v, sig.r, sig.s))
  );
  return signerAddress === address;
}
