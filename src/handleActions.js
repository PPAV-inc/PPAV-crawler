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

const sendGenericMessage = (recipientId, title, str, url, img_url) => {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: title,
            subtitle: str,
            item_url: url,               
            image_url: img_url,
            buttons: [{
              type: "web_url",
              url: url,
              title: "開啟網頁"
            }],
          }]
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
  console.log(messageData);
  callSendAPI(messageData);
};

const startedConv = (recipientId) => {
  let name = '';

  request({
    url: 'https://graph.facebook.com/v2.6/'+ recipientId +'?fields=first_name',
    qs: {access_token: PAGE_TOKEN},
    method: 'GET'
  }, (error, response, body) => {
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
      '點擊數：' + value.count + '\n' +
      '番號：' + value.code + '\n' +
      '女優：' + value.models;
    sendGenericMessage(senderID, value.title, str, value.url, value.img_url);
  })
  console.log(returnArr);
};

export const receivedMessage = (event) => {
  const senderID = event.sender.id,
        recipientID = event.recipient.id,
        timeOfMessage = event.timestamp,
        message = event.message;
  let   firstStr = '',
        messageText = message.text;
        
  if (messageText !== undefined) {
    firstStr = messageText.split('')[0];
    messageText = messageText.replace(/\s/g, '');
  }
        
  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  
  if (messageText === 'PPAV' || messageText === 'ppav' || messageText === 'Ppav') {
    findThreeVideos((returnArr) => { 
      returnFinalStr(senderID, returnArr)
    })
  } else {
    switch (firstStr) {
      case '＃':
      case '#':
        findVideo('code', messageText.split(firstStr)[1], (returnObj) => {
          let str = '';
          if (returnObj.results.length == 0) {
            str = '搜尋不到此番號';
            sendTextMessage(senderID, str);
          } else {
            str = '幫你搜尋: '+returnObj.search_value;
            sendTextMessage(senderID, returnObj.search_value);
            returnFinalStr(senderID, returnObj.results);
          }
        });
        break;
      case '％':
      case '%':
        findVideo('models', messageText.split(firstStr)[1], (returnObj) => {
          let str = '';
          if (returnObj.results.length == 0) {
            str = '搜尋不到此女優';
            sendTextMessage(senderID, str);
          } else {
            str = '幫你搜尋: '+returnObj.search_value;
            sendTextMessage(senderID, str);
            returnFinalStr(senderID, returnObj.results);
          }
        });
        break;
      case '＠':
      case '@':
        findVideo('title', messageText.split(firstStr)[1], (returnObj) => {
          let str = '';
          if (returnObj.results.length == 0) {
            str = '搜尋不到此片名';
            sendTextMessage(senderID, str);
          } else {
            str = '幫你搜尋: '+returnObj.search_value;
            sendTextMessage(senderID, str);
            returnFinalStr(senderID, returnObj.results);
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

  startedConv(senderID);
};
