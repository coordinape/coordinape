import chalk from 'chalk';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import morgan from 'morgan';

import address from '../api/cosoul/[address]';
import artTokenId from '../api/cosoul/art/[artTokenId]';
import tokenId from '../api/cosoul/metadata/[tokenId]';
import screenshot from '../api/cosoul/screenshot/[tokenId]';
import verify from '../api/cosoul/verify';
import discord from '../api/discord/oauth';
import verifyEmail from '../api/email/verify/[uuid]';
import actionManager from '../api/hasura/actions/actionManager';
import auth from '../api/hasura/auth';
import checkNominee from '../api/hasura/cron/checkNominee';
import dailyUpdate from '../api/hasura/cron/dailyUpdate';
import ensNames from '../api/hasura/cron/ensNames';
import epochs from '../api/hasura/cron/epochs';
import pGiveHistoricalGen from '../api/hasura/cron/pGiveHistoricalGen';
import recoverTransactions from '../api/hasura/cron/recoverTransactions';
import syncCoSouls from '../api/hasura/cron/syncCoSouls';
import eventManager from '../api/hasura/event_triggers/eventManager';
import vaults from '../api/hasura/remote/vaults';
import join from '../api/join/[token]';
import log from '../api/log';
import login from '../api/login';
import mpTrack from '../api/mp/track';
import time from '../api/time';
import twitter_callback from '../api/twitter/callback';
import twitter_login from '../api/twitter/login';
import alchemy_cosoul from '../api/webhooks/alchemy_cosoul';
import alchemy_key_trade from '../api/webhooks/alchemy_key_trade';

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

app.get('/api/discord/oauth', tf(discord));
app.get('/api/hasura/auth', tf(auth));
app.post('/api/hasura/actions/actionManager', tf(actionManager));
app.post('/api/hasura/event_triggers/eventManager', tf(eventManager));
app.post('/api/hasura/cron/checkNominee', tf(checkNominee));
app.post('/api/hasura/cron/dailyUpdate', tf(dailyUpdate));
app.post('/api/hasura/cron/ensNames', tf(ensNames));
app.post('/api/hasura/cron/epochs', tf(epochs));
app.post('/api/hasura/cron/pGiveHistoricalGen', tf(pGiveHistoricalGen));
app.post('/api/hasura/cron/recoverTransactions', tf(recoverTransactions));
app.post('/api/hasura/cron/syncCoSouls', tf(syncCoSouls));
app.get('/api/hasura/remote/vaults', tf(vaults));
app.post('/api/hasura/remote/vaults', tf(vaults));
app.get('/api/join/:token', (req, res) => {
  return tf(join)({ ...req, query: req.params }, res);
});

// TODO: probably rename these to match prod, but this overlaps with :address route
app.post('/api/_cosoul/verify', tf(verify));
app.post('/api/webhooks/alchemy_cosoul', tf(alchemy_cosoul));
app.post('/api/webhooks/alchemy_key_trade', tf(alchemy_key_trade));
app.get('/api/_cosoul/verify', tf(verify));
app.get('/api/cosoul/:address', (req, res) => {
  return tf(address)({ ...req, query: req.params }, res);
});
app.get('/api/cosoul/art/:artTokenId', (req, res) => {
  return tf(artTokenId)({ ...req, query: req.params }, res);
});
app.get('/api/cosoul/metadata/:tokenId', (req, res) => {
  return tf(tokenId)({ ...req, query: req.params }, res);
});
app.get('/api/cosoul/screenshot/:tokenId', (req, res) => {
  return tf(screenshot)({ ...req, query: req.params }, res);
});

app.get('/api/email/verify/:uuid', (req, res) => {
  return tf(verifyEmail)({ ...req, query: req.params }, res);
});

app.post('/api/log', tf(log));
app.post('/api/login', tf(login));
app.post('/api/mp/track', tf(mpTrack));
app.get('/api/time', tf(time));
app.get('/api/twitter/login', tf(twitter_login));
app.get('/api/twitter/callback', tf(twitter_callback));

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
