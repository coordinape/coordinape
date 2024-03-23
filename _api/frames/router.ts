import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function (req: VercelRequest, res: VercelResponse) {
  return res.status(200).send({ url: req.url, query: req.query });
}
