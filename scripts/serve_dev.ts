import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import morgan from 'morgan';

import landing from '../api/circle/landing/[token]';
import actionManager from '../api/hasura/actions/actionManager';
import auth from '../api/hasura/auth';
import checkNominee from '../api/hasura/cron/checkNominee';
import dailyUpdate from '../api/hasura/cron/dailyUpdate';
import epochs from '../api/hasura/cron/epochs';
import recoverTransactions from '../api/hasura/cron/recoverTransactions';
import eventManager from '../api/hasura/event_triggers/eventManager';
import login from '../api/login';
import time from '../api/time';

const app = express();
app.use(express.json()); // for parsing application/json

if (process.env.DEV_LOGGING) {
  // log all requests to STDOUT
  app.use(morgan('🚀 :method :url :status :response-time ms'));
}

const port = process.argv[2];
const proxyPort = process.argv[3];

// warning: ordering is important!
// express passes requests through the routes in the order
// that they are instantiated.
// We want the root to fall back to the proxy and not
// override any of the routes before it

// handlers are typed to only accept VercelRequest and VercelResponse
// so we shim them with this (tf = "type fudge")
const tf = (handler: any) => (req: any, res: any) => handler(req, res);

app.get('/api/circle/landing/:token', (req, res) => {
  return tf(landing)({ ...req, query: req.params }, res);
});
app.get('/api/hasura/auth', tf(auth));
app.post('/api/hasura/actions/actionManager', tf(actionManager));
app.post('/api/hasura/event_triggers/eventManager', tf(eventManager));
app.post('/api/hasura/cron/checkNominee', tf(checkNominee));
app.post('/api/hasura/cron/dailyUpdate', tf(dailyUpdate));
app.post('/api/hasura/cron/epochs', tf(epochs));
app.post('/api/hasura/cron/recoverTransactions', tf(recoverTransactions));
app.post('/api/login', tf(login));
app.get('/api/time', tf(time));

// return empty analytics code
app.get('/stats/js/script.js', (req, res) => {
  return res.format({ 'application/javascript': () => res.send('') });
});

app.use(
  '/',
  createProxyMiddleware({ target: `http://localhost:${proxyPort}` })
);

app.listen(port, () => {
  console.log(`==========================================================`);
  console.log(`Development server has started successfully!`);
  console.log(`Visit http://localhost:${port} to view the Coordinape app.`);
  console.log(`==========================================================`);
});
