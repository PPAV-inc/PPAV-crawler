import 'babel-polyfill';
import Router from 'koa-router';
import config from '../config';
import receivedPostback from '../utils/receivedPostback';
import { receivedMessage } from '../utils/receivedMessage';

const VERIFY_TOKEN = config.VERIFY_TOKEN;

const webhookRouter = new Router();

webhookRouter.get('/webhook', async ctx => {
    const req = ctx.request;
    const res = ctx.response;
    if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
      res.body = req.query['hub.challenge'];
    } else {
      res.body = 'Error, wrong validation token';
    }
});

webhookRouter.post('/webhook', async (ctx) => {
  const data = ctx.request.body;
  
  if (data.object === 'page') {
    data.entry.forEach((pageEntry) => {
      pageEntry.messaging.forEach((messagingEvent) => {
        if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        } else if (messagingEvent.postback) { // first time
          receivedPostback(messagingEvent);
        } else {
          console.log(`Webhook received unknown messagingEvent: ${messagingEvent}`);
        }
      });
    });
    ctx.response.body = 200;
  }
});

export default webhookRouter;
