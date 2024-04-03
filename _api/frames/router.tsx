/* eslint-disable no-console */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { ReadableStream } from 'node:stream/web';
import React from 'react';

import { VercelRequest, VercelResponse } from '@vercel/node';
import { ImageResponse } from '@vercel/og';
import { Path } from 'path-parser';

import { IS_LOCAL_ENV } from '../../api-lib/config.ts';
import { webAppURL } from '../../src/config/webAppURL';

import { FramePostInfo, getFramePostInfo } from './_getFramePostInfo.tsx';
import { ErrorFrame } from './ErrorFrame';
import { RenderFrameMeta } from './FrameMeta';
import { FrontDoor } from './FrontDoorFrame';
import { GiveGiverFrame } from './give/GiveGiverFrame';
import { GiveHomeFrame } from './give/GiveHomeFrame';
import { GiveReceiverFrame } from './give/GiveReceiverFrame';
import { HelpFrame } from './HelpFrame';
import { MintSuccessFrame } from './MintSuccessFrame';
import { PersonaFourFrame } from './personas/PersonaFourFrame';
import { PersonaOneFrame } from './personas/PersonaOneFrame';
import { PersonaThreeFrame } from './personas/PersonaThreeFrame';
import { PersonaTwoFrame } from './personas/PersonaTwoFrame';
import { PersonaZeroFrame } from './personas/PersonaZeroFrame';

export const FRAME_ROUTER_URL_BASE = `${webAppURL('colinks')}/api/frames/router`;

export const getFrameUrl = (frameId: string, resourceId?: number) => {
  let url = `${FRAME_ROUTER_URL_BASE}/meta/${frameId}`;

  if (resourceId) {
    url += `/${resourceId}`;
  }
  return url;
};

type PathWithHandler = {
  path: Path;
  handler: (
    req: VercelRequest,
    res: VercelResponse,
    params: Record<string, any>
  ) => void;
  method: 'GET' | 'POST';
};

declare type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
declare type Style = 'normal' | 'italic';

interface FontOptions {
  data: Buffer | ArrayBuffer;
  name: string;
  weight?: Weight;
  style?: Style;
  lang?: string;
}

// this function is critical to triggering the node file tracing file bundling
// if this is removed/changed significantly, you need to run pnpm build and look in
// .vercel/output/functions/router.func to make sure ttfs are still there.
// this function has to be in the main router.tsx file for tracing to work :smh:
export const getPath = (name: string) =>
  join(process.cwd(), 'public', 'fonts', `${name}.ttf`);

const createFont = (name: string, file: string) => {
  let fontData: ArrayBuffer;
  if (IS_LOCAL_ENV) {
    fontData = readFileSync(getPath(file));
  } else {
    fontData = readFileSync(join(__dirname, `./${file}.ttf`));
  }

  return {
    name: name,
    data: fontData,
  };
};

export const loadFonts = (): FontOptions[] => {
  const startTime = Date.now();
  // these references to the files need to include the join __dirname so that
  // node file tracing finds them easily enough
  const fonts = [
    {
      ...createFont('Denim', `Denim-Regular`),
      weight: 400,
      style: 'normal',
    },
    {
      ...createFont('Denim', 'Denim-RegularItalic'),
      weight: 400,
      style: 'italic',
    },
    {
      ...createFont('Denim', 'Denim-SemiBold'),
      weight: 600,
      style: 'normal',
    },
    {
      ...createFont('Denim', 'Denim-SemiBoldItalic'),
      weight: 600,
      style: 'italic',
    },
  ];
  const endTime = Date.now();
  // eslint-disable-next-line no-console
  console.log('Font load time:', endTime - startTime, 'ms');
  return fonts as FontOptions[];
};

//load the fonts just once, not once per handler
const fonts = loadFonts();

const router: {
  paths: PathWithHandler[];
} = {
  paths: [],
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
    const pathParts = path.split('?');
    const url = pathParts[0];
    const pathParams = p.test(url);

    if (pathParams) {
      const nestedQueryParams = new URLSearchParams(pathParts[1]);
      const combinedParams = {
        ...pathParams,
        ...queryParams,
      };
      for (const [key, value] of nestedQueryParams.entries()) {
        combinedParams[key] = value;
      }
      return (req: VercelRequest, res: VercelResponse) => {
        handler(req, res, combinedParams);
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
  errorMessage?: string;
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
        res.setHeader('Content-Type', 'text/html');
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
    `/img/${frame.id}${frame.resourceIdentifier.resourcePathExpression}`,
    'GET',
    async (_req, res, params) => {
      const ir = new ImageResponse(await frame.imageNode(params), {
        // debug: true,
        height: 1000,
        width: 1000,
        fonts,
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
      res.setHeader('Content-Type', 'image/png');
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
    if (returnFrame.errorMessage) {
      params['error_message'] = returnFrame.errorMessage;
    }
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
addFrame(ErrorFrame());
addFrame(HelpFrame);
addFrame(FrontDoor);
