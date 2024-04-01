/* eslint-disable no-console */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { ReadableStream } from 'node:stream/web';
import React from 'react';

import { VercelRequest, VercelResponse } from '@vercel/node';
import { ImageResponse } from '@vercel/og';
import { Path } from 'path-parser';

import { IS_LOCAL_ENV } from '../../api-lib/config';
import { webAppURL } from '../../src/config/webAppURL';

import { RenderFrameMeta } from './FrameMeta';
import { FramePostInfo, getFramePostInfo } from './getFramePostInfo';
import { GiveGiverFrame } from './give/GiveGiverFrame';
import { GiveHomeFrame } from './give/GiveHomeFrame';
import { GiveReceiverFrame } from './give/GiveReceiverFrame';
import { ErrorFrame } from './personas/ErrorFrame';
import { MintSuccessFrame } from './personas/MintSuccessFrame';
import { PersonaFourFrame } from './personas/PersonaFourFrame';
import { PersonaOneFrame } from './personas/PersonaOneFrame';
import { PersonaThreeFrame } from './personas/PersonaThreeFrame';
import { PersonaTwoFrame } from './personas/PersonaTwoFrame';
import { PersonaZeroFrame } from './personas/PersonaZeroFrame';

export const FRAME_ROUTER_URL_BASE = `${webAppURL('colinks')}/api/frames/router`;

declare type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
declare type Style = 'normal' | 'italic';
interface FontOptions {
  data: Buffer | ArrayBuffer;
  name: string;
  weight?: Weight;
  style?: Style;
  lang?: string;
}

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

const getPath = (name: string) =>
  join(process.cwd(), 'public', 'fonts', `${name}.ttf`);
const createFont = async (name: string, file: string) => {
  // TODO: fix font loading in vercel, url fetching is very slow

  let fontData: ArrayBuffer;
  if (IS_LOCAL_ENV) {
    fontData = await readFile(getPath(file));
  } else {
    const baseUrl = webAppURL('colinks');
    const path = new URL(`${baseUrl}/fonts/${file}.ttf`);
    // eslint-disable-next-line no-console

    fontData = await fetch(path).then(res => res.arrayBuffer());
  }

  return {
    name: name,
    data: fontData,
  };
};

export default async function (req: VercelRequest, res: VercelResponse) {
  const { path, ...queryParams } = req.query;

  if (!path) {
    return res.status(404).send(`no path provided`);
  }
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).send(`method not supported ${req.method}`);
  }
  const handler = getHandler(
    '/' + ((path as string) ?? ''),
    req.method,
    queryParams as Record<string, string>
  );
  if (!handler) {
    return res.status(404).send(`no handler found for ${path}`);
  }
  return handler(req, res);
}

const getHandler = (
  path: string,
  m: 'GET' | 'POST',
  queryParams: Record<string, string>
) => {
  for (const { path: p, handler, method } of router.paths) {
    if (method !== m) {
      continue;
    }

    // Don't test against query params but pass them in
    const url = path.split('?')[0];
    const pathParams = p.test(url);
    if (pathParams) {
      return (req: VercelRequest, res: VercelResponse) => {
        handler(req, res, { ...pathParams, ...queryParams });
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

  const loadFonts = async (): Promise<FontOptions[]> => {
    const startTime = Date.now();
    const fonts = await Promise.all([
      {
        ...(await createFont('Denim', 'Denim-Regular')),
        weight: 400,
        style: 'normal',
      },
      {
        ...(await createFont('Denim', 'Denim-RegularItalic')),
        weight: 400,
        style: 'italic',
      },
      {
        ...(await createFont('Denim', 'Denim-SemiBold')),
        weight: 600,
        style: 'normal',
      },
      {
        ...(await createFont('Denim', 'Denim-SemiBoldItalic')),
        weight: 600,
        style: 'italic',
      },
    ]);
    const endTime = Date.now();
    console.log('Font load time:', endTime - startTime, 'ms');
    return fonts as FontOptions[];
  };

  // always add an image route
  addPath(
    `/img/${frame.id}${frame.resourceIdentifier.resourcePathExpression}`,
    'GET',
    async (_req, res, params) => {
      const ir = new ImageResponse(await frame.imageNode(params), {
        // debug: true,
        height: 1000,
        width: 1000,
        fonts: await loadFonts(),
      });
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
    return RenderFrameMeta({ frame: returnFrame, res, params, info });
  }
};

addFrame(GiveHomeFrame);
addFrame(GiveGiverFrame);
addFrame(GiveReceiverFrame);
addFrame(PersonaZeroFrame);
addFrame(PersonaOneFrame);
addFrame(PersonaTwoFrame);
addFrame(PersonaThreeFrame);
addFrame(PersonaFourFrame);
addFrame(PersonaFourFrame);
addFrame(MintSuccessFrame);
addFrame(ErrorFrame);
