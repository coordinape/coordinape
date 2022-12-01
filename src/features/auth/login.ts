import type { Web3Provider } from '@ethersproject/providers';
import { generateNonce, SiweMessage } from 'siwe';

import { getSignature } from 'utils/provider';

const SIWE_EXPIRES_AFTER = 5 * 60000;

const generatePayload = async (
  address: string,
  time: number,
  nonce: string,
  provider: Web3Provider,
  chainId = 1
) => {
  const message = new SiweMessage({
    domain: window.location.host,
    address,
    statement: 'Coordinape wants to Sign-In With Ethereum',
    uri: window.location.origin,
    version: '1',
    chainId,
    nonce,
    notBefore: new Date(time).toISOString(),
    expirationTime: new Date(time + SIWE_EXPIRES_AFTER).toISOString(),
  });
  const data = message.prepareMessage();
  const { signature, hash } = await getSignature(data, provider);
  return {
    signature,
    hash,
    address,
    data,
  };
};

export const login = async (
  address: string,
  provider: Web3Provider
): Promise<{ token: string }> => {
  let nonce, time;
  try {
    const nonceReq = await fetch('/api/time');
    ({ nonce, time } = JSON.parse(await nonceReq.text()));
  } catch (e) {
    nonce = generateNonce();
    time = Date.now();
  }

  const { chainId } = await provider.getNetwork();

  const payload = await generatePayload(
    address,
    time,
    nonce,
    provider,
    chainId
  );

  const resp = await fetch('/api/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input: { payload } }),
  });

  const body = await resp.json();
  if (!resp.ok) {
    throw new Error(
      `${resp.status} ${resp.statusText}: ${
        body.error?.message || body.message || 'No message'
      }`
    );
  }

  return body;
};
