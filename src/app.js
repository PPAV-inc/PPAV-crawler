'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import request from 'request';
import path from 'path';
import config from '../config';
import { findThreeVideos, findVideo } from './mongodb';

const app = express();
const port = process.env.PORT || 8080;
const VERIFY_TOKEN = config.VERIFY_TOKEN;
const PAGE_TOKEN = config.PAGE_TOKEN;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const callSendAPI = (messageData) => {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const recipientId = body.recipient_id,
            messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      // console.error(response);
    }
  });  
};

const sendTextMessage = (recipientId, messageText) => {
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
};

const startedConv = (recipientId) => {
  let name = '';

  request({
    url: 'https://graph.facebook.com/v2.6/'+ recipientId +'?fields=first_name',
    qs: {access_token: PAGE_TOKEN},
    method: 'GET'
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    } else {
      name = JSON.parse(body);
      sendTextMessage(recipientId, "Hello "+ name.first_name + ", do you have a pen? ")
    }
  });
};

const returnFinalStr = (senderID, returnArr) => {
  returnArr.forEach((value) => {
    let str = 
      '片名：' + value.title + '\n' + 
      '番號：' + value.code + '\n' +
      '女優：' + value.models + '\n' + 
      value.url;
    sendTextMessage(senderID, str);
  })
};

const receivedMessage = (event) => {
  const senderID = event.sender.id,
        recipientID = event.recipient.id,
        timeOfMessage = event.timestamp,
        message = event.message,
        messageText = message.text,
        firstStr = messageText.split('')[0];
        
  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  
  if (messageText === 'PPAV') {
    findThreeVideos((returnArr) => { 
      returnFinalStr(senderID, returnArr)
    })
  } else {
    switch (firstStr) {
      case '#':
        findVideo('code', messageText.split('#')[1], (returnArr) => {
          if (returnArr.length == 0) {
            let str = '搜尋不到此番號';
            sendTextMessage(senderID, str);
          } else {
            returnFinalStr(senderID, returnArr)
          }
        });
        break;
        
      case '%':
        findVideo('models', messageText.split('%')[1], (returnArr) => {
          let str = '';
          if (returnArr.length == 0) {
            str = '搜尋不到此女優';
            sendTextMessage(senderID, str);
          } else {
            returnFinalStr(senderID, returnArr)
          }
        });
        break;
      case '@':
        findVideo('title', messageText.split('@')[1], (returnArr) => {
          let str = '';
          if (returnArr.length == 0) {
            str = '搜尋不到此片名';
            sendTextMessage(senderID, str);
          } else {
            returnFinalStr(senderID, returnArr)
          }
        });
        break;  
      default:
        sendTextMessage(senderID, '想看片請輸入 PPAV');
        break;
    }
  }
};

const receivedPostback = (event) => {
  const senderID = event.sender.id,
        recipientID = event.recipient.id,
        timeOfPostback = event.timestamp,
        payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " + 
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to 
  // let them know it was successful
  startedConv(senderID);
};

app.get('/webhook/', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
})

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object == 'page') {
    data.entry.forEach(function(pageEntry) {
      pageEntry.messaging.forEach(function(messagingEvent) {
        if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        } else if (messagingEvent.postback) {
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
app.listen(port, () => console.log(`listening on port ${port}`));
