import mp from 'mixpanel-browser';
// FIXME should be able to just use `crypto`, but couldn't get the polyfill to
// work in webpack
import shajs from 'sha.js';

import { isFeatureEnabled } from '../../config/features';

const enabled = !!process.env.REACT_APP_MIXPANEL_TOKEN;

export const initFrontend = () => {
  if (!enabled) return;

  mp.init(process.env.REACT_APP_MIXPANEL_TOKEN as string, {
    api_host: process.env.REACT_APP_MIXPANEL_HOST,
    debug: true,
    ignore_dnt: isFeatureEnabled('ignore_dnt'),
  });

  if (typeof window !== 'undefined') {
    (window as any).testMp = () => {
      mp.track('test', { foo: 'bar' });
    };
  }
};

export const track = (name: string, props: any) =>
  enabled && mp.track(name, props);

export const identify = (profileId: number) =>
  enabled && mp.identify(`profile_${obfuscateId(String(profileId))}`);

export const obfuscateId = (input: string) =>
  shajs('sha256').update(input).digest('base64');

// replace numeric IDs, invite tokens, addresses with placeholders
// so that they can be aggregated in reports
export const normalizePath = (pathname: string) =>
  pathname
    .replace(new RegExp('/[0-9]+(/|$)', 'g'), '/:number$1')
    .replace(new RegExp('/[a-f0-9-]{36}(/|$)'), '/:token$1')
    .replace(new RegExp('/0x[A-Fa-f0-9-]{40}(/|$)'), '/:address$1');
