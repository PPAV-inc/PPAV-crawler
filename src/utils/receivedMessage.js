import sendGenericMessage from './sendGenericMessage';
import sendTextMessage from './sendTextMessage';
import findThreeVideos from '../models/findThreeVideos';
import saveLogData from '../models/saveLogData';
import saveSubscribeData from '../models/saveSubscribeData';
import removeSubscribeId from '../models/removeSubscribeId';
import findVideo from '../models/findVideo';

const sendGenericMessageByArr = (senderID, returnArr) => {
  return new Promise(resolve => {
    let elements = [];
    
    returnArr.forEach((value) => {
      let date = new Date(value.update_date);
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
    
    sendGenericMessage(senderID, elements).then(returnBool => {
      if (returnBool) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

const receivedMessage = (event) => {
  const senderID = event.sender.id,
        recipientID = event.recipient.id,
        timeOfMessage = event.timestamp,
        message = event.message;

  let firstStr = '',
      messageText = message.text;

  if (messageText !== undefined) {
    firstStr = messageText.split('')[0];
    messageText = messageText.replace(/\s/g, '');
  }

  console.log(`Received message for user ${senderID} and page ${recipientID} at ${timeOfMessage} with message:`);

  if (messageText === 'PPAV' || messageText === 'ppav' || messageText === 'Ppav') {
    findThreeVideos().then(returnArr => {
      sendGenericMessageByArr(senderID, returnArr).then(returnBool => {
        if (returnBool) {
          saveLogData(true, {
            senderID: senderID,
            messageText: messageText,
            result: 'PPAV',
          });
        }
      });
    });
  } else if (messageText === 'GGinin' || messageText === 'GGININ' || messageText === 'gginin' || messageText === 'Gginin') {
    saveSubscribeData(senderID).then(str => {
      sendTextMessage(senderID, str);
      const str2 = '想看片請輸入 PPAV \n\n其他搜尋功能：\n1. 搜尋番號："# + 番號" \n2. 搜尋女優："% + 女優"\n3. 搜尋片名："@ + 關鍵字"';
      sendTextMessage(senderID, str2);
    });
  } else if (messageText === 'NoGG' || messageText === 'NOGG' || messageText === 'nogg' || messageText === 'noGG' || messageText === 'Nogg') {
    removeSubscribeId(senderID).then(str => {
      sendTextMessage(senderID, str);
      const str2 = '想看片請輸入 PPAV \n\n其他搜尋功能：\n1. 搜尋番號："# + 番號" \n2. 搜尋女優："% + 女優"\n3. 搜尋片名："@ + 關鍵字"\n\n訂閱每日推播："GGININ"';
      sendTextMessage(senderID, str2);
    });
  } else {
    switch (firstStr) {
      case '＃':
      case '#':
        findVideo('code', messageText.split(firstStr)[1].toUpperCase()).then(returnObj => {
          let str = '';
          if (returnObj.results.length === 0) {
            str = '搜尋不到此番號';
            sendTextMessage(senderID, str).then(returnBool => {
              if (returnBool) {
                saveLogData(false, {
                  senderID: senderID,
                  messageText: messageText,
                  result: str,
                });
              }
            });
          } else {
            str = `幫你搜尋：${returnObj.search_value}`;
            sendTextMessage(senderID, str).then(() => {
              sendGenericMessageByArr(senderID, returnObj.results).then(returnBool => {
                if (returnBool) {
                  saveLogData(true, {
                    senderID: senderID,
                    messageText: messageText,
                    result: str,
                  });
                }
              });
            });
          }
        });
        break;
      case '％':
      case '%':
        findVideo('models', messageText.split(firstStr)[1]).then(returnObj => {
          let str = '';
          if (returnObj.results.length === 0) {
            str = '搜尋不到此女優';
            sendTextMessage(senderID, str).then(returnBool => {
              if (returnBool) {
                saveLogData(false, {
                  senderID: senderID,
                  messageText: messageText,
                  result: str,
                });
              }
            });
          } else {
            str = `幫你搜尋：${returnObj.search_value}`;
            sendTextMessage(senderID, str).then(() => {
              sendGenericMessageByArr(senderID, returnObj.results).then(returnBool => {
                if (returnBool) {
                  saveLogData(true, {
                    senderID: senderID,
                    messageText: messageText,
                    result: str,
                  });
                }
              });
            });
          }
        });
        break;
      case '＠':
      case '@':
        findVideo('title', messageText.split(firstStr)[1]).then(returnObj => {
          let str = '';
          if (returnObj.results.length === 0) {
            str = '搜尋不到此片名';
            sendTextMessage(senderID, str).then(returnBool => {
              if (returnBool) {
                saveLogData(false, {
                  senderID: senderID,
                  messageText: messageText,
                  result: str,
                });
              }
            });
          } else {
            str = `幫你搜尋：${returnObj.search_value}`;
            sendTextMessage(senderID, str).then(() => {
              sendGenericMessageByArr(senderID, returnObj.results).then(returnBool => {
                if (returnBool) {
                  saveLogData(true, {
                    senderID: senderID,
                    messageText: messageText,
                    result: str,
                  });
                }
              });
            });
          }
        });
        break;
      default:
        const str = '想看片請輸入 PPAV \n\n其他搜尋功能：\n1. 搜尋番號："# + 番號" \n2. 搜尋女優："% + 女優"\n3. 搜尋片名："@ + 關鍵字"\n\n訂閱每日推播："GGININ"';
        sendTextMessage(senderID, str);
        break;
    }
  }
};

export { receivedMessage, sendGenericMessageByArr };
