import { VercelRequest, VercelResponse } from '@vercel/node';
import { Path } from 'path-parser';

type PathWithHandler = {
  path: Path;
  handler: (
    req: VercelRequest,
    res: VercelResponse,
    params: Record<string, any>
  ) => void;
};

const router: {
  paths: PathWithHandler[];
} = {
  paths: [],
};

export default async function (req: VercelRequest, res: VercelResponse) {
  const handler = getHandler(req.url ?? '');
  if (!handler) {
    return res.status(404).send(`no handler found for ${req.url}`);
  }
  return handler(req, res);
}

const getHandler = (path: string) => {
  for (const { path: p, handler } of router.paths) {
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
  handler: (
    req: VercelRequest,
    res: VercelResponse,
    params: Record<string, any>
  ) => void
) => {
  const p = new Path(path);
  router.paths.push({
    path: p,
    handler,
  });
  return path;
};

addPath('/love/bananas', (req, res, params) => {
  return res
    .status(200)
    .send({ url: req.url, query: req.query, msg: 'naked banans', params });
});
addPath('/love/bananas/:pathId', (req, res, params) => {
  return res
    .status(200)
    .send({ url: req.url, query: req.query, msg: 'banana with path', params });
});
