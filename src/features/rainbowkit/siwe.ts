import { createAuthenticationAdapter } from '@rainbow-me/rainbowkit';
import { client } from 'lib/gql/client';
import { generateNonce, SiweMessage } from 'siwe';

export const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    return generateNonce();
  },
  createMessage: ({ nonce, address, chainId }) => {
    return new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Coordinape wants to Sign-In With Ethereum',
      uri: window.location.origin,
      version: '1',
      chainId,
      nonce,
    });
  },
  getMessageBody: ({ message }) => {
    return message.prepareMessage();
  },
  verify: async ({ message, signature }) => {
    // const data = generateMessage({ address, time, nonce, chainId });
    // // this triggers a signature prompt for the user
    // const { signature, hash } = await getSignature(
    //   data,
    //   provider,
    //   connectorName != 'magic'
    // );
    const data = message.prepareMessage();

    const payload = {
      signature,
      hash: '',
      address: message.address,
      data,
      connectorName: 'injected',
    };
    console.log({ payload });
    const resp = await fetch('/api/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: { payload } }),
    });

    return Boolean(resp.ok);
  },
  signOut: async () => {
    await client.mutate(
      { logoutUser: { id: true } },
      { operationName: 'logout' }
    );
  },
});
