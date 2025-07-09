import type { VercelRequest, VercelResponse } from '@vercel/node';

import { errorResponse } from '../../api-lib/HttpError';
import { updateTokenBalanceForAddress } from '../../api-lib/tokenBalances';
import { getTokenContract } from '../webhooks/alchemy_token_transfers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    let { address, contract } = req.body;
    // eslint-disable-next-line no-console
    console.log({ address, contract });

    if (!address || typeof address !== 'string') {
      return res
        .status(400)
        .json({ error: 'Missing or invalid address parameter' });
    }
    if (!contract || typeof contract !== 'string') {
      return res
        .status(400)
        .json({ error: 'Missing or invalid contract parameter' });
    }

    address = address.toLowerCase();
    contract = contract.toLowerCase();

    const tokenContract = getTokenContract(contract);
    if (!tokenContract) {
      console.error('No contract found for address:', tokenContract);
      return res.status(404).json({ error: 'Contract not found' });
    }

    // eslint-disable-next-line no-console
    console.log(
      'Updating token balance for contract / address:',
      contract,
      address
    );
    await updateTokenBalanceForAddress(tokenContract, address);

    return res.status(200).json({ message: 'Token balance refreshed' });
  } catch (e) {
    return errorResponse(res, e);
  }
}
