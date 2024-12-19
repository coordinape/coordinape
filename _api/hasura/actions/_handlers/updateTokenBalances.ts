import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponse } from '../../../../api-lib/HttpError';
import { updateTokenBalanceForAddress } from '../../../../api-lib/tokenBalances';
import { getTokenContract } from '../../../webhooks/alchemy_token_transfers';

const updateTokenBalancesInput = z
  .object({
    token_address: z.string(),
    address: z.string(),
  })
  .strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      payload: { address, token_address },
    } = await getInput(req, updateTokenBalancesInput, {
      allowAdmin: true,
    });
    const token = getTokenContract(token_address);

    if (!token) {
      return res.status(400).json({ success: false, error: 'Token not found' });
    }

    await updateTokenBalanceForAddress(token, address);

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}
