import request from 'request';
import { findThreeVideos, findVideo } from './mongodb';
import config from '../config';

const PAGE_TOKEN = config.PAGE_TOKEN;

const callSendAPI = (messageData) => {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_TOKEN },
    method: 'POST',
    json: messageData

  }, (error, response, body) => {
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

const sendImageMessage = (recipientId, imagesUrl) => {
  console.log(imagesUrl);
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: imagesUrl
        }
      }
    }
  };

  callSendAPI(messageData);
}

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
      '點擊數：' + value.count + '\n' +
      '番號：' + value.code + '\n' +
      '女優：' + value.models + '\n\n' + 
      value.url;
    console.log(value);
    sendImageMessage(senderID, value.img_url);
    sendTextMessage(senderID, str);
  })
};

export const receivedMessage = (event) => {
  const senderID = event.sender.id,
        recipientID = event.recipient.id,
        timeOfMessage = event.timestamp,
        message = event.message,
        messageText = message.text;
  let   firstStr = '';
        
  if (messageText !== undefined)  
    firstStr = messageText.split('')[0];
        
  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  
  if (messageText === 'PPAV' || messageText === 'ppav') {
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
        let str = '想看片請輸入 PPAV \n\n其他搜尋功能：\n1. 搜尋番號："# + 番號" \n2. 搜尋女優："% + 女優"\n3. 搜尋片名："@ + 關鍵字"'
        sendTextMessage(senderID, str);
        break;
    }
  }
};

export const receivedPostback = (event) => {
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