import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { BigNumber, Contract } from 'ethers';

import { isValidSignature } from '../../api-lib/alchemySignature';
import { errorResponse } from '../../api-lib/HttpError';
import { getProvider } from '../../api-lib/provider';
import {
  TokenContract,
  TOKENS,
  updateTokenBalanceForAddress,
} from '../../api-lib/tokenBalances';

export type TokenTransferTx = {
  from: string;
  to: string;
  value: BigNumber;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const signature = req.headers['x-alchemy-signature'] as string;
    assert(signature, 'Missing signature');

    // TODO: if multiple webhooks for different chains this will be different...
    const signingKey = process.env
      .TOKEN_TRANSFER_WEBHOOK_ALCHEMY_SIGNING_KEY as string;
    assert(signingKey, 'Missing alchemy signing key for token transfers');

    if (!(await isValidSignature(req, signature, signingKey))) {
      res.status(400).send('Webhook signature not valid');
      return;
    }

    const payload = req.body;

    // eslint-disable-next-line no-console
    console.log('RECEIVED WEBHOOK PAYLOAD:', JSON.stringify(payload));

    const {
      event: {
        data: {
          block: { logs },
        },
      },
    } = payload;

    for (const log of logs) {
      const contract_address = log.account.address;
      // eslint-disable-next-line no-console
      console.log('Processing log for contract:', contract_address, log);

      const contract = getTokenContract(contract_address);
      if (!contract) {
        console.error('No contract found for address:', contract_address);
        continue;
      }

      const parsedLog = await parseLog(contract, log);

      await updateTokenBalanceForAddress(contract, parsedLog.args.from);
      await updateTokenBalanceForAddress(contract, parsedLog.args.to);
    }

    return res.status(200).send({ success: true });
  } catch (error: any) {
    return errorResponse(res, error);
  }
}

const getTokenContract = (contract_address: string) => {
  return TOKENS.find(
    token => token.contract.toLowerCase() === contract_address.toLowerCase()
  );
};

const parseLog = async (tokenContract: TokenContract, rawLog: any) => {
  const chainId = Number(tokenContract.chain);
  const provider = getProvider(chainId);

  const abi = [
    'event Transfer(address indexed from, address indexed to, uint256 value)',
  ];

  const contractAddress = tokenContract.contract;
  const contract = new Contract(contractAddress, abi, provider);

  const logDesc = contract.interface.parseLog(rawLog);
  return logDesc;
};
