import assert from 'assert';

import { VercelRequest } from '@vercel/node';

export const isCoLinksRequest = (req: VercelRequest) => {
  const hostname = req.headers.host;
  assert(hostname, 'hostname is missing');

  const isCoLinks = !hostname.includes('app.');
  return { isCoLinks, hostname };
};
