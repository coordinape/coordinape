import assert from 'assert';
import { useEffect } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { ConnectExtension } from '@magic-ext/connect';
import type { EthNetworkConfiguration } from '@magic-sdk/types';
import { Magic } from 'magic-sdk';

import { IN_PRODUCTION } from 'config/env';

const API_KEY = process.env.REACT_APP_MAGIC_API_KEY;
export const PROVIDER_TYPE = 'magic';

// FIXME fix typing here
//
// the return type changes depending on the extensions used, so just doing
// `let magic: Magic` doesn't work
let magic: any;

const networks: Record<string, EthNetworkConfiguration> = {
  mainnet: 'mainnet',
  goerli: 'goerli',
  polygon: {
    rpcUrl: 'https://polygon-rpc.com/',
    chainId: 137,
  },
};

export const getMagic = () => {
  assert(API_KEY, 'REACT_APP_MAGIC_API_KEY is missing');

  if (!magic) {
    // TODO have a more integrated way of picking the network
    // TODO try using arbitrary RPC URLs e.g. testchain
    const override = localStorage.getItem('magic:network') || '';
    const network =
      networks[override] ||
      (IN_PRODUCTION ? networks.mainnet : networks.goerli);

    magic = new Magic(API_KEY, {
      network,
      extensions: [new ConnectExtension()],
    });
  }

  (window as any).magic = magic;
  return magic;
};

export const getMagicProvider = async () => {
  // FIXME
  // @ts-ignore
  const provider = new Web3Provider(getMagic().rpcProvider);
  const accounts = await provider.listAccounts();
  console.log(accounts[0]); // eslint-disable-line
  return provider;
};

export const MagicModalFixer = () => {
  // Radix's modal interferes with Magic's modal because it sets
  // "pointer-events: none" on document.body; we use the hack below to fix that
  useEffect(() => {
    const iframe = document.querySelector('iframe.magic-iframe');
    if (!iframe) return;

    const observer = new MutationObserver(mutations => {
      if (mutations.some(m => m.attributeName === 'style')) {
        const magicVisible =
          (iframe as HTMLIFrameElement).style.display !== 'none';
        if (magicVisible) document.body.style['pointerEvents'] = 'auto';
      }
    });
    observer.observe(iframe, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return null;
};
