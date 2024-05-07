/* eslint-disable no-console */

/* NOTE: this file uses Vercel OG, so ***ANY*** exported function that is used in another handler will cause Vercel OG to try and load fonts and fail.
 * Don't export functions from this file
 * */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { ReadableStream } from 'node:stream/web';

import { VercelRequest, VercelResponse } from '@vercel/node';
import { ImageResponse } from '@vercel/og';
import { Path } from 'path-parser';

import { IS_LOCAL_ENV } from '../../api-lib/config.ts';
import {
  FramePostInfo,
  getFramePostInfo,
} from '../../api-lib/frames/_getFramePostInfo.tsx';
import { ErrorFrame } from '../../api-lib/frames/ErrorFrame.tsx';
import { RenderFrameMeta } from '../../api-lib/frames/FrameMeta.tsx';
import { Frame } from '../../api-lib/frames/frames.ts';
import { FrontDoor } from '../../api-lib/frames/FrontDoorFrame.tsx';
import { GiveHomeFrame } from '../../api-lib/frames/give/GiveHomeFrame.tsx';
import { GivePartyHomeFrame } from '../../api-lib/frames/giveparty/GivePartyHomeFrame.tsx';
import { GivePartyMintCoSoulFrame } from '../../api-lib/frames/giveparty/GivePartyMintCoSoulFrame.tsx';
import { GivePartyMintWaitingFrame } from '../../api-lib/frames/giveparty/GivePartyMintWaitingFrame.tsx';
import { JoinedPartyFrame } from '../../api-lib/frames/giveparty/JoinedPartyFrame.tsx';
import { JoinedSurprisePartyFrame } from '../../api-lib/frames/giveparty/JoinedSurprisePartyFrame.tsx';
import { PartyHelpFrame } from '../../api-lib/frames/giveparty/PartyHelpFrame.tsx';
import { PartyStartFrame } from '../../api-lib/frames/giveparty/PartyStartFrame.tsx';
import { ProfileFrame } from '../../api-lib/frames/giveparty/ProfileFrame.tsx';
import { SkillLeaderboardFrame } from '../../api-lib/frames/giveparty/SkillLeaderboardFrame.tsx';
import { SurprisePartyHelpFrame } from '../../api-lib/frames/giveparty/SurprisePartyHelpFrame.tsx';
import { SurprisePartyHomeFrame } from '../../api-lib/frames/giveparty/SurprisePartyHomeFrame.tsx';
import { SurprisePartyStartFrame } from '../../api-lib/frames/giveparty/SurprisePartyStartFrame.tsx';
import { HelpFrame } from '../../api-lib/frames/HelpFrame.tsx';
import { MintSuccessFrame } from '../../api-lib/frames/MintSuccessFrame.tsx';
import { MintWaitingFrame } from '../../api-lib/frames/MintWaitingFrame.tsx';
import { PersonaFourFrame } from '../../api-lib/frames/personas/PersonaFourFrame.tsx';
import { PersonaOneFrame } from '../../api-lib/frames/personas/PersonaOneFrame.tsx';
import { PersonaThreeFrame } from '../../api-lib/frames/personas/PersonaThreeFrame.tsx';
import { PersonaTwoFrame } from '../../api-lib/frames/personas/PersonaTwoFrame.tsx';
import { PersonaZeroFrame } from '../../api-lib/frames/personas/PersonaZeroFrame.tsx';

// 1 hour
const maxAge = 60 * 60;

const CACHE_CONTENT = `s-maxage=${maxAge} max-age=${maxAge} stale-while-revalidate=${maxAge * 2}`;

// no caching:
// const CACHE_CONTENT =  'no-store, no-cache, must-revalidate, max-age=0'

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

// this forces all the image paths to be bundled/traced
// don't delete this, even if it isn't used
export const getImagePath = (name: string) =>
  join(process.cwd(), 'public', 'imgs', 'frames', `${name}.jpg`);

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

// don't delete this, even if it isn't used
export const createImage = (fileNameWithExt: string) => {
  let imageData: ArrayBuffer;
  const file = fileNameWithExt.replace('.jpg', '');
  if (IS_LOCAL_ENV) {
    imageData = readFileSync(getImagePath(file));
  } else {
    imageData = readFileSync(join(__dirname, `./${file}.jpg`));
  }
  return imageData;
};

export const loadFonts = (): FontOptions[] => {
  try {
    console.log('Begin trying to load fonts');
    const startTime = Date.now();
    // these references to the files need to include the join __dirname so that
    // node file tracing finds them easily enough
    const fonts = [
      {
        ...createFont('Denim', `Denim-Regular`),
        weight: 400,
        style: 'normal',
      },
      // {
      //   ...createFont('Denim', 'Denim-RegularItalic'),
      //   weight: 400,
      //   style: 'italic',
      // },
      {
        ...createFont('Denim', 'Denim-SemiBold'),
        weight: 600,
        style: 'normal',
      },
      // {
      //   ...createFont('Denim', 'Denim-SemiBoldItalic'),
      //   weight: 600,
      //   style: 'italic',
      // },
    ];
    const endTime = Date.now();
    // eslint-disable-next-line no-console
    console.log('Font load time:', endTime - startTime, 'ms');
    return fonts as FontOptions[];
  } catch (e) {
    console.error('Error loading fonts', e);
    return [] as FontOptions[];
  }
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

const addFrame = (frame: Frame) => {
  if (frame.homeFrame) {
    addPath(
      `/meta/${frame.id}${frame.resourceIdentifier.resourcePathExpression}`,
      'GET',
      (_req, res, params) => {
        if (IS_LOCAL_ENV) {
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        } else {
          res.setHeader('Cache-Control', CACHE_CONTENT);
        }
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

      if (IS_LOCAL_ENV) {
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      } else {
        res.setHeader('Cache-Control', CACHE_CONTENT);
      }
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
        ...(frame.aspectRatio === '1.91:1'
          ? {
              height: 600,
              width: 1146,
            }
          : {
              height: 1000,
              width: 1000,
            }),
        fonts,
      });
      if (IS_LOCAL_ENV) {
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      } else {
        res.setHeader('Cache-Control', CACHE_CONTENT);
      }
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
addFrame(PersonaZeroFrame);
addFrame(PersonaOneFrame);
addFrame(PersonaTwoFrame);
addFrame(PersonaThreeFrame);
addFrame(PersonaFourFrame);
addFrame(PersonaFourFrame);
addFrame(MintSuccessFrame);
addFrame(MintWaitingFrame);
addFrame(ErrorFrame());
addFrame(HelpFrame);
addFrame(FrontDoor);

// GiveParty
addFrame(GivePartyHomeFrame());
addFrame(JoinedPartyFrame);
addFrame(PartyHelpFrame());
addFrame(GivePartyMintCoSoulFrame);
addFrame(GivePartyMintWaitingFrame);
addFrame(PartyStartFrame(''));
addFrame(SkillLeaderboardFrame());
addFrame(ProfileFrame());

// Surprise Party
addFrame(SurprisePartyHelpFrame());
addFrame(SurprisePartyStartFrame(''));
addFrame(JoinedSurprisePartyFrame);
addFrame(SurprisePartyHomeFrame(''));
