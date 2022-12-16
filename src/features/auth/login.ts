import type { Web3Provider } from '@ethersproject/providers';
import { generateNonce, SiweMessage } from 'siwe';

import { getSignature } from 'utils/provider';

const SIWE_EXPIRES_AFTER = 5 * 60000;

export const generateMessage = ({
  address,
  time = Date.now(),
  nonce,
  chainId = 1,
}: {
  address: string;
  time?: number;
  nonce?: string;
  chainId?: number;
}) => {
  const message = new SiweMessage({
    domain: window.location.host,
    address,
    statement: 'Coordinape wants to Sign-In With Ethereum',
    uri: window.location.origin,
    version: '1',
    chainId,
    nonce: nonce || generateNonce(),
    notBefore: new Date(time).toISOString(),
    expirationTime: new Date(time + SIWE_EXPIRES_AFTER).toISOString(),
  });
  return message.prepareMessage();
};

export const login = async (
  address: string,
  provider: Web3Provider,
  connectorName: string
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

  const data = generateMessage({ address, time, nonce, chainId });
  // this triggers a signature prompt for the user
  const { signature, hash } = await getSignature(data, provider);
  const payload = { signature, hash, address, data, connectorName };

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
