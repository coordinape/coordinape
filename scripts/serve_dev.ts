import chalk from 'chalk';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import morgan from 'morgan';

import address from '../_api/cosoul/[address]';
import artTokenId from '../_api/cosoul/art/[artTokenId]';
import tokenId from '../_api/cosoul/metadata/[tokenId]';
import screenshot from '../_api/cosoul/screenshot/[tokenId]';
import discord from '../_api/discord/oauth';
import verifyEmail from '../_api/email/verify/[uuid]';
import verifyEmailWaitList from '../_api/email/verifywaitlist/[uuid]';
import github_callback from '../_api/github/callback';
import github_login from '../_api/github/login';
import actionManager from '../_api/hasura/actions/actionManager';
import auth from '../_api/hasura/auth';
import checkNominee from '../_api/hasura/cron/checkNominee';
import colinksNotificationEmails from '../_api/hasura/cron/colinksNotificationEmails';
import dailyReportEmail from '../_api/hasura/cron/dailyReportEmail';
import dailyUpdate from '../_api/hasura/cron/dailyUpdate';
import ensNames from '../_api/hasura/cron/ensNames';
import epochs from '../_api/hasura/cron/epochs';
import fetchPoapData from '../_api/hasura/cron/fetchPoapData';
import generatePoapEmbeddings from '../_api/hasura/cron/generatePoapEmbeddings';
import hourlyReportEmail from '../_api/hasura/cron/hourlyReportEmail';
import pGiveHistoricalGen from '../_api/hasura/cron/pGiveHistoricalGen';
import recoverTransactions from '../_api/hasura/cron/recoverTransactions';
import syncCoSouls from '../_api/hasura/cron/syncCoSouls';
import updateMagicEmails from '../_api/hasura/cron/updateMagicEmails';
import eventManager from '../_api/hasura/event_triggers/eventManager';
import vaults from '../_api/hasura/remote/vaults';
import join from '../_api/join/[token]';
import linkedin_callback from '../_api/linkedin/callback';
import linkedin_login from '../_api/linkedin/login';
import log from '../_api/log';
import login from '../_api/login';
import mpTrack from '../_api/mp/track';
import og_profileInfo from '../_api/og/profileinfo/[address]';
import og_tags from '../_api/og/tags';
import time from '../_api/time';
import twitter_callback from '../_api/twitter/callback';
import twitter_login from '../_api/twitter/login';
import alchemy_cosoul from '../_api/webhooks/alchemy_cosoul';
import alchemy_link_tx from '../_api/webhooks/alchemy_link_tx';

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
app.post('/api/hasura/cron/dailyReportEmail', tf(dailyReportEmail));
app.post('/api/hasura/cron/hourlyReportEmail', tf(hourlyReportEmail));
app.post('/api/hasura/cron/dailyUpdate', tf(dailyUpdate));
app.post('/api/hasura/cron/ensNames', tf(ensNames));
app.post('/api/hasura/cron/epochs', tf(epochs));
app.post('/api/hasura/cron/fetchPoapData', tf(fetchPoapData));
app.post('/api/hasura/cron/updateMagicEmails', tf(updateMagicEmails));
app.post('/api/hasura/cron/generatePoapEmbeddings', tf(generatePoapEmbeddings));
app.post('/api/hasura/cron/pGiveHistoricalGen', tf(pGiveHistoricalGen));
app.post('/api/hasura/cron/recoverTransactions', tf(recoverTransactions));
app.post('/api/hasura/cron/syncCoSouls', tf(syncCoSouls));
app.get('/api/hasura/remote/vaults', tf(vaults));
app.post('/api/hasura/remote/vaults', tf(vaults));
app.post(
  '/api/hasura/cron/colinksNotificationEmails',
  tf(colinksNotificationEmails)
);
app.get('/api/join/:token', (req, res) => {
  return tf(join)({ ...req, query: req.params }, res);
});

// TODO: probably rename these to match prod, but this overlaps with :address route
app.post('/api/webhooks/alchemy_cosoul', tf(alchemy_cosoul));
app.post('/api/webhooks/alchemy_link_tx', tf(alchemy_link_tx));
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

app.get('/api/og/profileinfo/:address', (req, res) => {
  return tf(og_profileInfo)({ ...req, query: req.params }, res);
});

app.get('/api/email/verifywaitlist/:uuid', (req, res) => {
  return tf(verifyEmailWaitList)({ ...req, query: req.params }, res);
});

app.post('/api/log', tf(log));
app.get('/api/og/tags', tf(og_tags));
app.post('/api/login', tf(login));
app.post('/api/mp/track', tf(mpTrack));
app.get('/api/time', tf(time));
app.get('/api/twitter/login', tf(twitter_login));
app.get('/api/twitter/callback', tf(twitter_callback));
app.get('/api/github/login', tf(github_login));
app.get('/api/github/callback', tf(github_callback));
app.get('/api/linkedin/login', tf(linkedin_login));
app.get('/api/linkedin/callback', tf(linkedin_callback));

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

export {};
