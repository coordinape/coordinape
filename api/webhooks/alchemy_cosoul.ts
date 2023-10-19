import assert from 'assert';
import type { Readable } from 'node:stream';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ethers } from 'ethers';

import { isValidSignatureForStringBody } from '../../api-lib/alchemySignature';
import { adminClient } from '../../api-lib/gql/adminClient';
import { errorResponse } from '../../api-lib/HttpError';
import { getMintInfofromLogs } from '../../src/features/cosoul/api/cosoul';
import { minted, burned } from '../hasura/actions/_handlers/syncCoSoul';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const signature = req.headers['x-alchemy-signature'] as string;
    assert(signature, 'Missing signature');

    const signingKey = process.env.COSOUL_WEBHOOK_ALCHEMY_SIGNING_KEY as string;
    assert(signingKey, 'Missing alchemy signing key');

    const rawBody = await parseRawBody(req);

    if (!isValidSignatureForStringBody(signature, rawBody, signingKey)) {
      res.status(400).send('Webhook signature not valid');
      return;
    }

    const payload = req.body;

    const {
      event: {
        data: {
          block: { logs },
        },
      },
    } = payload;

    for (const log of logs) {
      await handleLog(log);
    }

    return res.status(200).send({ success: true });
  } catch (error: any) {
    return errorResponse(res, error);
  }
}

const handleLog = async (log: any) => {
  const mintInfo = await getMintInfofromLogs(log);
  assert(mintInfo);

  const { transaction } = log;
  assert(transaction.hash);

  const profileId = await getProfileIdFromAddress(mintInfo.to);

  if (mintInfo.from == ethers.constants.AddressZero) {
    await minted(mintInfo.to, transaction.hash, mintInfo.tokenId, profileId);
  } else if (mintInfo.to == ethers.constants.AddressZero) {
    await burned(mintInfo.from, profileId);
  } else {
    // eslint-disable-next-line no-console
    console.log('WTF: cosoul transferred... txHash: ', transaction.hash);
  }
};

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

  const profileId: number | undefined = data?.profiles[0]?.id;

  return profileId;
};

const parseRawBody = async (req: VercelRequest) => {
  let buf, rawBody;
  if (req.method === 'POST') {
    buf = await buffer(req);
    rawBody = buf.toString('utf8');
  }
  assert(rawBody, 'parseRawBody failed to construct a body from request.');
  return rawBody;
};

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}
