import { VercelRequest, VercelResponse } from '@vercel/node';

const handler = (
  req: VercelRequest,
  res: VercelResponse,
  params: Record<string, any>
) => {
  return res
    .status(200)
    .send({ url: req.url, query: req.query, msg: 'horse moments', params });
};

export default handler;
