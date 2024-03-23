import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import morgan from 'morgan';

const app = express();
// you create your desired Express router
const router = express.Router();

// define the handlers for your router in the usual express router fashion
router.get('/test', function (_req, res) {
  res.send('/test Custom API handled this request');
});
router.all('/(.*)', function (req, res) {
  res.send({ url: req.url });
});

// your create an Express instance

// hook your router into the Express instance in the normal way
app.use('/', router);
app.use(express.json({ limit: '10mb' })); // for parsing application/json

if (process.env.DEV_LOGGING) {
  // log all requests to STDOUT
  app.use(morgan('ϟ :method :url :status :response-time ms'));
}

export default async function (req: VercelRequest, res: VercelResponse) {
  app._router.handle(req, res);
}
