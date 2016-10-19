import bodyParser from 'body-parser';
import express from 'express';
import jsonfile from 'jsonfile';
import path from 'path';
import { receivedMessage, receivedPostback } from './handleActions'; 

const jsonPath = path.join(__dirname, '..', 'config.json');
const config = jsonfile.readFileSync(jsonPath);
const VERIFY_TOKEN = config.VERIFY_TOKEN;

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/webhook/', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
})

app.post('/webhook', (req, res) => {
  const data = req.body;
  // Make sure this is a page subscription
  if (data.object == 'page') {
    data.entry.forEach((pageEntry) => {
      pageEntry.messaging.forEach((messagingEvent) => {
        if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        } else if (messagingEvent.postback) { // first time
          receivedPostback(messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });
    });

    // Must send back a 200, within 20 seconds, to let facebook know you've 
    // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200);
  }
});

app.use(express.static(path.join(__dirname, '/../public')));
app.listen(port, () => console.log('listening on port ${port}'));
