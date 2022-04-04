import assert from 'assert';
import { randomBytes, createHash } from 'crypto';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  bufferToHex,
  fromRpcSig,
  fromAscii,
  ecrecover,
  hashPersonalMessage,
  toBuffer,
  pubToAddress,
} from 'ethereumjs-util';
import { DateTime, Settings } from 'luxon';

import { adminClient } from '../api-lib/gql/adminClient';
import { errorResponse } from '../api-lib/HttpError';
import { composeCrossClientAuthRequestBody, loginInput } from '../src/lib/zod';

Settings.defaultZone = 'utc';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const input = parseInput(req);

    try {
      const verificationResult = verifySignature(input);
      if (!verificationResult) {
        return errorResponse(res, {
          message: 'invalid signature',
          httpStatus: 401,
        });
      }
    } catch (e: unknown) {
      return errorResponse(res, {
        message: 'invalid signature: ' + e,
        httpStatus: 401,
      });
    }

    const { profiles } = await adminClient.query({
      profiles: [
        { where: { address: { _ilike: input.address } } },
        { id: true },
      ],
    });

    let profile = profiles.pop();
    const tokenString = generateTokenString();

    if (!profile) {
      const { insert_profiles_one } = await adminClient.mutate({
        insert_profiles_one: [
          { object: { address: input.address } },
          { id: true },
        ],
      });
      profile = insert_profiles_one;
    }
    assert(profile, 'panic: profile must exist');

    const now = DateTime.now().toISO();

    const { insert_personal_access_tokens_one: token } =
      await adminClient.mutate({
        delete_personal_access_tokens: [
          { where: { profile: { address: { _ilike: input.address } } } },
          { affected_rows: true },
        ],
        insert_personal_access_tokens_one: [
          {
            object: {
              name: 'circle-access-token',
              abilities: '["read"]',
              tokenable_type: 'App\\Models\\Profile',
              tokenable_id: profile.id,
              token: createHash('sha256').update(tokenString).digest('hex'),
              updated_at: now,
              created_at: now,
              last_used_at: now,
            },
          },
          { id: true },
        ],
      });

    return res.status(200).json({ token: `${token?.id}|${tokenString}` });
  } catch (error: any) {
    errorResponse(res, error);
  }
}

function generateTokenString(len = 40): string {
  const bufSize = len * 2;
  if (bufSize > 65536) {
    const e = new Error();
    (e as any).code = 22;
    e.message = `Quota exceeded: requested ${bufSize} > 65536 bytes`;
    e.name = 'QuotaExceededError';
    throw e;
  }
  const candidateString = randomBytes(bufSize).toString('base64').slice(0, len);
  if (candidateString.includes('/') || candidateString.includes('+'))
    return generateTokenString(len);
  return candidateString;
}

export function verifySignature(input: SignatureInput) {
  // generate the message hash and split out the r, s, v params
  const msgHash = hashPersonalMessage(toBuffer(fromAscii(input.data)));

  const sig = fromRpcSig(input.signature);
  // pass all data into ecrecover and verify the returned address matches
  // the provided address.
  const signerAddress = bufferToHex(
    pubToAddress(ecrecover(msgHash, sig.v, sig.r, sig.s))
  );
  return signerAddress === input.address;
}

function parseInput(req: VercelRequest) {
  const {
    input: { payload: input },
  } = composeCrossClientAuthRequestBody(loginInput).parse(req.body);

  return input;
}

type SignatureInput = ReturnType<typeof parseInput>;
