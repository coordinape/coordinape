import { VercelRequest, VercelResponse } from '@vercel/node';

import { RenderFrameImage } from './frames/router/FrameImage.tsx';

export default async function (_req: VercelRequest, res: VercelResponse) {
  RenderFrameImage({ res });
}
