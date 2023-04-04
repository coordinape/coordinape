import chalk from 'chalk';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import morgan from 'morgan';

import discord from '../api/discord/oauth';
import actionManager from '../api/hasura/actions/actionManager';
import auth from '../api/hasura/auth';
import checkNominee from '../api/hasura/cron/checkNominee';
import dailyUpdate from '../api/hasura/cron/dailyUpdate';
import ensNames from '../api/hasura/cron/ensNames';
import epochs from '../api/hasura/cron/epochs';
import historicalActivity from '../api/hasura/cron/historicalActivity';
import pGiveHistoricalGen from '../api/hasura/cron/pGiveHistoricalGen';
import recoverTransactions from '../api/hasura/cron/recoverTransactions';
import eventManager from '../api/hasura/event_triggers/eventManager';
import vaults from '../api/hasura/remote/vaults';
import join from '../api/join/[token]';
import login from '../api/login';
import time from '../api/time';

const app = express();
app.use(express.json({ limit: '10mb' })); // for parsing application/json

if (process.env.DEV_LOGGING) {
  // log all requests to STDOUT
  app.use(morgan('ϟ :method :url :status :response-time ms'));
}

// this global is set when this file is run with `nyc`
if ((global as any).__coverage__) {
  app.get('/__coverage__', (req, res) => {
    res.json({
      coverage: (global as any).__coverage__ || null,
    });
  });
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

app.get('/api/join/:token', (req, res) => {
  return tf(join)({ ...req, query: req.params }, res);
});
app.get('/api/hasura/auth', tf(auth));
app.post('/api/hasura/actions/actionManager', tf(actionManager));
app.post('/api/hasura/event_triggers/eventManager', tf(eventManager));
app.post('/api/hasura/cron/checkNominee', tf(checkNominee));
app.post('/api/hasura/cron/dailyUpdate', tf(dailyUpdate));
app.post('/api/hasura/cron/ensNames', tf(ensNames));
app.post('/api/hasura/cron/epochs', tf(epochs));
app.post('/api/hasura/cron/pGiveHistoricalGen', tf(pGiveHistoricalGen));
app.post('/api/hasura/cron/recoverTransactions', tf(recoverTransactions));
app.post('/api/hasura/cron/historicalActivity', tf(historicalActivity));
app.get('/api/hasura/remote/vaults', tf(vaults));
app.post('/api/hasura/remote/vaults', tf(vaults));
app.post('/api/login', tf(login));
app.get('/api/time', tf(time));
app.get('/api/discord/oauth', tf(discord));

// return empty analytics code
app.get('/stats/js/script.js', (req, res) => {
  return res.format({ 'application/javascript': () => res.send('') });
});

app.use(
  '/',
  createProxyMiddleware({
    target: `http://localhost:${proxyPort}`,
    logLevel: 'warn',
  })
);

app.listen(port, () => {
  /* eslint-disable */
  console.log(`==========================================================`);
  console.log(`Development server has started successfully!`);
  console.log(
    `Visit`,
    chalk.bold(`http://localhost:${port}`),
    `to view the Coordinape app.`
  );
  console.log(`==========================================================`);
  /* eslint-enable */
});
