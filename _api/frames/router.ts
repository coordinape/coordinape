import express from 'express';
import morgan from 'morgan';

const app = express();
app.use(express.json({ limit: '10mb' })); // for parsing application/json

if (process.env.DEV_LOGGING) {
  // log all requests to STDOUT
  app.use(morgan('ϟ :method :url :status :response-time ms'));
}

app.get('(.*)', (_req, res) => {
  console.log({ request: _req, url: _req.url });
  res.status(201).send('ok dude');
});
