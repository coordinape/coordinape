import { webAppURL } from '../../src/config/webAppURL.ts';

import { Frame } from './frames.ts';

const FRAME_ROUTER_URL_BASE = `${webAppURL('colinks')}/api/frames/router`;

export const prefetchFrame = async (frame: Frame, resourceId?: string) => {
  const timeout = new Promise(resolve =>
    setTimeout(() => resolve('timeout'), 100)
  );

  await Promise.race([
    fetch(getFrameUrl(frame.id, resourceId)),
    fetch(getFrameImgUrl(frame.id, resourceId)),
    timeout,
  ]);
};

const getFrameUrl = (frameId: string, resourceId?: string) => {
  let url = `${FRAME_ROUTER_URL_BASE}/meta/${frameId}`;

  if (resourceId) {
    url += `/${resourceId}`;
  }
  return url;
};

const getFrameImgUrl = (frameId: string, resourceId?: string) => {
  let url = `${FRAME_ROUTER_URL_BASE}/img/${frameId}`;

  if (resourceId) {
    url += `/${resourceId}`;
  }
  return url;
};
