import { Web3Provider } from '@ethersproject/providers';
import { generateNonce, SiweMessage } from 'siwe';

import { getSignature } from 'utils/provider';

import { IApiLogin } from 'types';

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
    let nonce;
    try {
      const nonceReq = await fetch('/api/time');
      nonce = await nonceReq.text();
    } catch (e) {
      nonce = generateNonce();
    }

    const message = new SiweMessage({
      // TODO: replace by configured domain
      domain: 'domain.tld',
      address,
      // TODO: replace by desired statement
      statement: 'Coordinape wants to Sign-In With Ethereum',
      // TODO: replace by configured domain and URI
      uri: 'https://domain.tld/',
      version: '1',
      chainId: 1,
      nonce,
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
    return await rawResponse.json();
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

export const getAuthToken = () => getApiService().token;
