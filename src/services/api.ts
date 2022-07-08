import { Web3Provider } from '@ethersproject/providers';
import { generateNonce, SiweMessage } from 'siwe';

import { getSignature } from 'utils/provider';

import { IApiLogin } from 'types';

const SIWE_EXPIRES_AFTER = 5 * 60000;

export class APIService {
  provider = undefined as Web3Provider | undefined;
  token = undefined as string | undefined;

  constructor(provider?: Web3Provider, token?: string) {
    this.provider = provider;
    token && this.setAuth(token);
  }

  setProvider(provider?: Web3Provider) {
    this.provider = provider;
  }

  setAuth(token?: string) {
    this.token = token;

    const auth: Record<string, unknown> = {};
    if (token) {
      const authHeader = 'Bearer ' + token;
      auth.headers = { Authorization: authHeader };
    }
  }

  login = async (address: string): Promise<IApiLogin> => {
    let nonce, time;
    try {
      const nonceReq = await fetch('/api/time');
      const nonceData = JSON.parse(await nonceReq.text());
      ({ nonce, time } = nonceData);
    } catch (e) {
      nonce = generateNonce();
      time = Date.now();
    }

    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Coordinape wants to Sign-In With Ethereum',
      uri: window.location.origin,
      version: '1',
      chainId: 1,
      nonce,
      notBefore: new Date(time).toISOString(),
      expirationTime: new Date(time + SIWE_EXPIRES_AFTER).toISOString(),
    });
    const data = message.prepareMessage();

    const { signature, hash } = await getSignature(data, this.provider);
    const rawResponse = await fetch('/api/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          payload: {
            signature,
            hash,
            address,
            data,
          },
        },
      }),
    });

    const body = await rawResponse.json();
    if (!rawResponse.ok) {
      throw new Error(
        `${rawResponse.status} ${rawResponse.statusText}: ${
          body.error?.message || body.message || 'No message'
        }`
      );
    }

    this.setAuth(body.token);
    return body;
  };
}

let apiService: APIService;

export const getApiService = (): APIService => {
  if (apiService) {
    return apiService;
  }
  apiService = new APIService();
  return apiService;
};

export const getAuthToken = () => {
  const token = getApiService().token;
  if (!token) throw new Error('auth token not set');
  return token;
};
