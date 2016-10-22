import Router from 'koa-router';
import config from '../config';
import receivedPostback from '../utils/receivedPostback';
import receivedMessage from '../utils/receivedMessage';

const VERIFY_TOKEN = config.VERIFY_TOKEN;

const webhookRouter = new Router();

webhookRouter.get('/webhook/', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

webhookRouter.post('/webhook', (req, res) => {
  const data = req.body;
  // Make sure this is a page subscription
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

    res.sendStatus(200);
  }
});
