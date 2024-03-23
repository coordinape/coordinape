import * as fs from 'fs';
import path from 'path';

import { VercelRequest, VercelResponse } from '@vercel/node';
import { Path } from 'path-parser';

const jsonPath = path.join(__dirname, '.');

const getFiles = () => {
  const handlerFiles: string[] = [];
  fs.readdir(jsonPath, (_err, files) => {
    files?.forEach(file => {
      handlerFiles.push(file);
    });
  });
  return handlerFiles;
};

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
  console.log('files', getFiles());
  const { path } = req.query;
  if (!path) {
    return res.status(404).send(`no path provided`);
  }
  const handler = getHandler('/' + ((path as string) ?? ''));
  if (!handler) {
    return res.status(404).send(`no handler found for ${path}`);
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
    .send({ url: req.url, query: req.query, msg: 'naked bananas', params });
});
addPath('/love/bananas/:banana', (req, res, params) => {
  return res
    .status(200)
    .send({ url: req.url, query: req.query, msg: 'banana with path', params });
});
