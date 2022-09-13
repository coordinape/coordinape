import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import actionManager from '../api/hasura/actions/actionManager';
import auth from '../api/hasura/auth';
import eventManager from '../api/hasura/event_triggers/eventManager';
import login from '../api/login';
import time from '../api/time';

const app = express();
app.use(express.json()); // for parsing application/json
const port = process.argv[2];
const proxyPort = process.argv[3];

// warning: ordering is important!
// express passes requests through the routes in the order
// that they are instantiated.
// We want the root to fall back to the proxy and not
// override any of the above routes

// we could technically pass requests directly into these handlers
// but they are typed to only accept VercelRequest and VercelResponse types
// and it doesn't seem worthwhile to sort that typing disparity with the
// Express types out at the moment
app.get('/api/time', (req: any, res: any) => {
  return time(req, res);
});

app.post('/api/login', (req: any, res: any) => {
  return login(req, res);
});

app.get('/api/hasura/auth', (req: any, res: any) => {
  return auth(req, res);
});

app.post('/api/hasura/actions/actionManager', (req: any, res: any) => {
  return actionManager(req, res);
});

app.post('/api/hasura/event_triggers/eventManager', (req: any, res: any) => {
  return eventManager(req, res);
});

// TODO implement routing for cron handlers, which are disabled by default in
// the dev environment

// return empty analytics code
app.get('/stats/js/script.js', (req, res) => {
  return res.format({ 'application/javascript': () => res.send('') });
});

const proxy = createProxyMiddleware({
  target: `http://localhost:${proxyPort}`,
});

app.use('/', proxy);

app.listen(port, () => {
  console.log(`Coordinape listening on port ${port}`);
});
