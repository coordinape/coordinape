// official docs:
// https://developer.mixpanel.com/docs/collection-via-a-proxy
//
// example proxy code (Python webserver):
// https://github.com/mixpanel/flask-tracking-proxy/blob/master/flask_proxy/app.py
//
// the example code above proxies several routes, but we only need one, since we
// add the client code as a node module and we're only using `track` &
// `identify`

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const body = await getBody(req);

  // TODO: this won't work we need to use native fetch and then fix the pipe
  const proxyRes = await fetch('https://api.mixpanel.com/track', {
    method: 'POST',
    body,
    // @ts-ignore
    headers: {
      ...req.headers,
      'X-REAL-IP': req.connection.remoteAddress,
      host: 'api.mixpanel.com',
    },
  });

  res.writeHead(proxyRes.status, Object.fromEntries(proxyRes.headers));
  const ab = await proxyRes.arrayBuffer();
  res.write(Buffer.from(ab));
}

const getBody = async (req: VercelRequest) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString();
};
