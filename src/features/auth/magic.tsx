import assert from 'assert';
import { useEffect } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { ConnectExtension } from '@magic-ext/connect';
import type { EthNetworkConfiguration } from '@magic-sdk/types';
import { Magic } from 'magic-sdk';

import { DebugLogger } from '../../common-lib/log';
import { IN_PRODUCTION } from 'config/env';

const logger = new DebugLogger('magic');

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
      (IN_PRODUCTION ? networks.polygon : networks.goerli);

    magic = new Magic(API_KEY, {
      network,
      extensions: [new ConnectExtension()],
    });
  }

  (window as any).magic = magic;
  return magic;
};

export const getMagicProvider = async () => {
  const m = getMagic();
  // @ts-ignore
  const provider = new Web3Provider(m.rpcProvider);
  const accounts = await provider.listAccounts();
  console.log(accounts[0]); // eslint-disable-line
  if (!accounts[0]) {
    m.wallet.connectWithUI();
  }
  return provider;
};

export const MagicModalFixer = () => {
  // Radix's modal interferes with Magic's modal because it sets
  // "pointer-events: none" on document.body; we use the hack below to fix that

  const togglePointerEvents = () => {
    const iframe = document.querySelector('iframe.magic-iframe');
    const visible = (iframe as HTMLIFrameElement)?.style.display !== 'none';
    logger.log(`iframe visible? ${visible}`);
    if (visible) document.body.style['pointerEvents'] = 'auto';
  };

  useEffect(() => {
    // iframeObs looks for style changes on the iframe
    const visibilityObs = new MutationObserver(mutations => {
      if (mutations.some(m => m.attributeName === 'style')) {
        togglePointerEvents();
      }
    });

    let appearanceObs: MutationObserver | undefined;
    const iframe = document.querySelector('iframe.magic-iframe');
    logger.log(`iframe present on startup? ${!!iframe}`);

    if (iframe) {
      // in some cases (e.g. the user already has a login token, but it's
      // expired), the iframe will appear right away, and we can already
      // start observing it
      togglePointerEvents();
      visibilityObs.observe(iframe, { attributes: true });
    } else {
      // but for new logins, it doesn't appear until after the user starts the
      // Email Login process, so we need another observer to detect the
      // appearance of the iframe
      const appearanceObs = new MutationObserver(mutations => {
        for (const m of mutations) {
          if (m.addedNodes.length == 0) continue;
          for (const node of m.addedNodes) {
            if ((node as HTMLElement).className === 'magic-iframe') {
              logger.log('found iframe thru observer');
              togglePointerEvents();
              visibilityObs.observe(node, { attributes: true });
              return;
            }
          }
        }
      });
      appearanceObs.observe(document.body, { childList: true });
    }

    return () => {
      appearanceObs?.disconnect();
      visibilityObs.disconnect();
    };
  }, []);

  return null;
};
