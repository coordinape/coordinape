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
export const KEY_MAGIC_NETWORK = 'magic:network';
// FIXME fix typing here
//
// the return type changes depending on the extensions used, so just doing
// `let magic: Magic` doesn't work
let magic: any;
let optMagic: any;

const networks: Record<string, EthNetworkConfiguration> = {
  mainnet: 'mainnet',
  goerli: 'goerli',
  polygon: {
    rpcUrl: 'https://polygon-rpc.com/',
    chainId: 137,
  },
  optimism: {
    rpcUrl: 'https://mainnet.optimism.io',
    chainId: 10,
  },
  optimism_goerli: {
    rpcUrl: 'https://goerli.optimism.io',
    chainId: 420,
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
  window.localStorage.setItem(
    KEY_MAGIC_NETWORK,
    IN_PRODUCTION ? 'polygon' : 'goerli'
  );
  (window as any).magic = magic;
  return magic;
};

export const getOptMagic = () => {
  assert(API_KEY, 'REACT_APP_MAGIC_API_KEY is missing');

  if (!optMagic) {
    const network = IN_PRODUCTION
      ? networks.optimism
      : networks.optimism_goerli;
    optMagic = new Magic(API_KEY, {
      network,
      extensions: [new ConnectExtension()],
    });
  }
  window.localStorage.setItem(KEY_MAGIC_NETWORK, 'optimism');
  (window as any).optMagic = optMagic;
  return optMagic;
};

export const getMagicProvider = async (network?: string) => {
  let m;
  if (network === 'optimism') {
    m = getOptMagic();
  } else {
    m = getMagic();
  }
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
    const iframes = document.querySelectorAll('iframe.magic-iframe');
    const visible = Array.from(iframes).some(
      iframe => (iframe as HTMLIFrameElement).style.display !== 'none'
    );
    logger.log(`iframes visible? ${visible}`);
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

    const handleIframeAppearance = (iframe: HTMLIFrameElement) => {
      logger.log('found iframe thru observer');
      togglePointerEvents();
      visibilityObs.observe(iframe, { attributes: true });
    };

    const observeIframe = (iframe: HTMLIFrameElement) => {
      togglePointerEvents();
      visibilityObs.observe(iframe, { attributes: true });
    };

    const iframes = document.querySelectorAll('iframe.magic-iframe');
    logger.log(`iframes present on startup? ${iframes.length > 0}`);

    if (iframes.length > 0) {
      // in some cases (e.g. the user already has a login token, but it's
      // expired), the iframe will appear right away, and we can already
      // start observing it
      Array.from(iframes).forEach(iframe =>
        observeIframe(iframe as HTMLIFrameElement)
      );
    } else {
      // but for new logins, it doesn't appear until after the user starts the
      // Email Login process, so we need another observer to detect the
      // appearance of the iframe
      appearanceObs = new MutationObserver(mutations => {
        mutations.forEach(m => {
          if (m.addedNodes.length === 0) return;
          Array.from(m.addedNodes).forEach(node => {
            if ((node as HTMLIFrameElement).className === 'magic-iframe') {
              handleIframeAppearance(node as HTMLIFrameElement);
            }
          });
        });
      });
      appearanceObs.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      appearanceObs?.disconnect();
      visibilityObs.disconnect();
    };
  }, []);

  return null;
};
