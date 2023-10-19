import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../api-lib/gql/adminClient';
import { errorResponse } from '../../api-lib/HttpError';
import { isValidSignature } from '../../api-lib/tenderlySignature';
import { getMintInfofromLogs } from '../../src/features/cosoul/api/cosoul';
import { minted } from '../hasura/actions/_handlers/syncCoSoul';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const signature = req.headers['x-tenderly-signature'] as string;
    const timestamp = req.headers['date'] as string;

    assert(signature, 'Missing signature');
    assert(timestamp, 'Missing timestamp');
    if (!isValidSignature(signature, JSON.stringify(req.body), timestamp)) {
      res.status(400).send('Webhook signature not valid');
      return;
    }

    const payload = req.body;
    const { transaction } = payload;

    const { block_hash } = transaction;

    const mintInfo = await getMintInfofromLogs(transaction.logs[0]);

    assert(block_hash);
    assert(mintInfo);

    const profileId = await getProfileIdFromAddress(mintInfo.to);

    await minted(mintInfo.to, block_hash, mintInfo.tokenId, profileId);

    return res.status(200).send({ success: true });
  } catch (error: any) {
    return errorResponse(res, error);
  }
}

const getProfileIdFromAddress = async (address: string) => {
  const data = await adminClient.query(
    {
      profiles: [
        {
          where: { address: { _ilike: address } },
          limit: 1,
        },
        { id: true },
      ],
    },
    { operationName: 'coSoulVerify__getProfileIdFromAddress' }
  );

  const profileId = data?.profiles[0]?.id;

  return profileId;
};
