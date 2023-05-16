import mp from 'mixpanel-browser';
// FIXME should be able to just use `crypto`, but couldn't get the polyfill to
// work in webpack
import shajs from 'sha.js';

const enabled = !!process.env.REACT_APP_MIXPANEL_TOKEN;

export const initFrontend = () => {
  if (!enabled) return;

  mp.init(process.env.REACT_APP_MIXPANEL_TOKEN as string, {
    api_host: process.env.REACT_APP_MIXPANEL_HOST,
    debug: true,
    ignore_dnt: true, // just for dev
  });

  if (typeof window !== 'undefined') {
    (window as any).testMp = () => {
      mp.track('test', { foo: 'bar' });
    };
  }
};

export const identify = (profileId: number) =>
  enabled && mp.identify(`profile_${obfuscateId(String(profileId))}`);

export const obfuscateId = (input: string) =>
  shajs('sha256').update(input).digest('base64');
