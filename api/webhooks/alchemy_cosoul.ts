/* eslint-disable no-console */
import assert from 'assert';

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

    // uncomment to test webhook
    const signingKey = process.env.COSOUL_WEBHOOK_ALCHEMY_SIGNING_KEY as string;
    assert(signingKey, 'Missing alchemy signing key');

    if (!isValidSignatureForStringBody(signature, req.body, signingKey)) {
      res.status(400).send('Webhook signature not valid');
      return;
    }

    const payload = req.body;
    console.log('payload', JSON.stringify(payload));

    const {
      event: {
        data: {
          block: { logs },
        },
      },
    } = payload;

    // iterate over logs
    for (const log of logs) {
      await handleLog(log);
    }

    return res.status(200).send({ success: true });
  } catch (error: any) {
    return errorResponse(res, error);
  }
}

const handleLog = async (log: any) => {
  const { topics, transaction } = log;
  console.log({ topics, transaction });

  const mintInfo = await getMintInfofromLogs(log);

  console.log({ mintInfo });

  assert(transaction.hash);
  assert(mintInfo);

  const profileId = await getProfileIdFromAddress(mintInfo.to);

  if (mintInfo.from == ethers.constants.AddressZero) {
    await minted(mintInfo.to, transaction.hash, mintInfo.tokenId, profileId);
  } else if (mintInfo.to == ethers.constants.AddressZero) {
    // duplicate burned ehre if they do through the UI??? and don't have profileId
    await burned(mintInfo.from, profileId);
  } else {
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
