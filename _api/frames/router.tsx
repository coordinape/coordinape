import { Readable } from 'node:stream';
import { ReadableStream } from 'node:stream/web';
import React from 'react';

import { VercelRequest, VercelResponse } from '@vercel/node';
import { ImageResponse } from '@vercel/og';
import { Path } from 'path-parser';

import { webAppURL } from '../../src/config/webAppURL';

import { RenderFrameMeta } from './FrameMeta';
import { FramePostInfo, getFramePostInfo } from './getFramePostInfo';
import { GiveGiverFrame } from './give/GiveGiverFrame';
import { GiveHomeFrame } from './give/GiveHomeFrame';
import { GiveRandoFrame } from './give/GiveRandoFrame';
import { GiveReceiverFrame } from './give/GiveReceiverFrame';

export const FRAME_ROUTER_URL_BASE = `${webAppURL('colinks')}/api/frames/router`;

type PathWithHandler = {
  path: Path;
  handler: (
    req: VercelRequest,
    res: VercelResponse,
    params: Record<string, any>
  ) => void;
  method: 'GET' | 'POST';
};

const router: {
  paths: PathWithHandler[];
} = {
  paths: [],
};

export default async function (req: VercelRequest, res: VercelResponse) {
  const { path } = req.query;
  if (!path) {
    return res.status(404).send(`no path provided`);
  }
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).send(`method not supported ${req.method}`);
  }
  const handler = getHandler('/' + ((path as string) ?? ''), req.method);
  if (!handler) {
    return res.status(404).send(`no handler found for ${path}`);
  }
  return handler(req, res);
}

const getHandler = (path: string, m: 'GET' | 'POST') => {
  for (const { path: p, handler, method } of router.paths) {
    if (method !== m) {
      continue;
    }
    const params = p.test(path);
    if (params) {
      return (req: VercelRequest, res: VercelResponse) => {
        handler(req, res, params);
      };
    }
  }
  return undefined;
};

const addPath = (
  path: string,
  method: 'GET' | 'POST',
  handler: (
    req: VercelRequest,
    res: VercelResponse,
    params: Record<string, string>
  ) => void
) => {
  const p = new Path(path);
  router.paths.push({
    path: p,
    method,
    handler,
  });
  return path;
};

// FRAME
// Image/Meta Tags
// Buttons
// - onPost -> Does Things, and redirects/returns a Frame???
// - externalLink

export type ResourceIdentifier = {
  resourcePathExpression: string;
  getResourceId: (params: Record<string, string>) => string;
};

export type Frame = {
  buttons: Button[];
  imageNode: (params: Record<string, string>) => Promise<React.JSX.Element>;
  id: string;
  homeFrame: boolean;
  resourceIdentifier: ResourceIdentifier;
};

export type Button = {
  title: string;
  action: 'post' | 'link';
  // only use target for external links
  target?: string;
  // only use onPost for post
  onPost?: (
    info: FramePostInfo,
    params: Record<string, string>
  ) => Promise<Frame>;
};

const addFrame = (frame: Frame) => {
  if (frame.homeFrame) {
    addPath(
      `/meta/${frame.id}${frame.resourceIdentifier.resourcePathExpression}`,
      'GET',
      (_req, res, params) => {
        res.setHeader(
          'Cache-Control',
          'no-store, no-cache, must-revalidate, max-age=0'
        );
        RenderFrameMeta({ frame, res, params });
      }
    );
  }

  // always add a post route
  addPath(
    `/post/${frame.id}${frame.resourceIdentifier.resourcePathExpression}`,
    'POST',
    async (req, res, params) => {
      // do things
      // actually parse the post????
      const info = await getFramePostInfo(req);
      res.setHeader(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, max-age=0'
      );
      return await handleButton(frame, params, info, res);
    }
  );

  // always add an image route
  addPath(
    `/img/${frame.id}${frame.resourceIdentifier.resourcePathExpression}?:ts`,
    'GET',
    async (_req, res, params) => {
      const ir = new ImageResponse(await frame.imageNode(params));
      // no cache
      //
      //Cache-Control: no-store, no-cache, must-revalidate, max-age=0
      // Pragma: no-cache
      // Expires: 0
      res.setHeader(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, max-age=0'
      );
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      Readable.fromWeb(ir.body as ReadableStream<any>).pipe(res);
    }
  );
};

const handleButton = async (
  frame: Frame,
  params: Record<string, string>,
  info: FramePostInfo,
  res: VercelResponse
) => {
  const button = frame.buttons[info.message.buttonIndex - 1];
  if (!button) {
    return res.send(400).send('invalid button index');
  }
  if (button.onPost) {
    const returnFrame = await button.onPost(info, params);
    return RenderFrameMeta({ frame: returnFrame, res, params });
  }
};

addFrame(GiveHomeFrame);
addFrame(GiveGiverFrame);
addFrame(GiveReceiverFrame);
addFrame(GiveRandoFrame);
