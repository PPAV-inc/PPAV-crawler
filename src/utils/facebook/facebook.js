import rp from 'request-promise';
import fetch from 'isomorphic-fetch';
import config from '../../config';

class FacebookOP {

  constructor() {
    this.PAGE_TOKEN = config.PAGE_TOKEN;
  }

  callSendAPI(messageData) {
    return new Promise(resolve => {
      const options = {
        method: 'POST',
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: this.PAGE_TOKEN },
        json: messageData,
      };

      rp(options)
        .then(parsedBody => {
          const recipientId = parsedBody.recipient_id;
          resolve(true);
          console.log(`成功送出 generic message 給 id '${recipientId}'`);
        })
        .catch(err => {
          resolve(false);
          console.error(`無法送出訊息. Error: ${err}`);
        });
    });
  }

  sendTyping(userId, option) {
    fetch(`https://graph.facebook.com/v2.6/me/messages?access_token=${this.PAGE_TOKEN}`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: {
          id: userId,
        },
        sender_action: option,
      }),
    });
  }

  sendTextMessage(recipientId, messageText) {
    return new Promise(resolve => {
      const messageData = {
        recipient: {
          id: recipientId,
        },
        message: {
          text: messageText,
        },
      };
      this.callSendAPI(messageData).then(returnBool => {
        if (returnBool) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  sendGenericMessage(recipientId, elements) {
    return new Promise(resolve => {
      const messageData = {
        recipient: {
          id: recipientId,
        },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements,
            },
          },
        },
      };

      this.callSendAPI(messageData).then(returnBool => {
        if (returnBool) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  sendGenericMessageByArr(senderID, returnArr) {
    return new Promise(resolve => {
      const elements = [];

      returnArr.forEach((value) => {
        const date = new Date(value.update_date);
        const dateFormat = `${date.getFullYear()}/${(date.getMonth() + 1)}/${date.getDate()}`;
        const str =
          `點擊數：${value.count}
           番號：${value.code}
           女優：${value.models}
           更新日期：${dateFormat}`;

        elements.push({
          title: value.title,
          subtitle: str,
          item_url: value.url,
          image_url: value.img_url,
          buttons: [{
            type: 'web_url',
            url: value.url,
            title: '開啟網頁',
          }],
        });
      });

      this.sendGenericMessage(senderID, elements).then(returnBool => {
        if (returnBool) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  sendButtonMessage(recipientId, text, buttons) {
    return new Promise(resolve => {
      const messageData = {
        recipient: {
          id: recipientId,
        },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text,
              buttons,
            },
          },
        },
      };

      this.callSendAPI(messageData).then(returnBool => {
        if (returnBool) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
}

export default FacebookOP;
