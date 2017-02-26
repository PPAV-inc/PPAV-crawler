import * as logs from '../models/logs';
import * as subscribe from '../models/subscribe';
import * as videos from '../models/videos';
import FacebookOP from './facebook';

const fb = new FacebookOP();

const receivedMessage = async (event) => {
  const senderID = event.sender.id,
        timeOfMessage = event.timestamp,
        message = event.message;

  let firstStr = '',
      messageText = message.text;
      
  fb.sendTyping(senderID, 'typing_on');

  if (messageText !== undefined) {
    firstStr = messageText.split('')[0];
    messageText = messageText.replace(/\s/g, '');
    const isUpdate = subscribe.updateUser(senderID, true);
    if (isUpdate) {
      console.log(`${senderID} 更新 isPushable 成功`);
    } else {
      console.log(`${senderID} 更新 isPushable 失敗`);
    }
  }

  console.log(`收到訊息：'${messageText}'，從 id '${senderID}' at ${timeOfMessage}`);

  if (messageText === 'PPAV' || messageText === 'ppav' || messageText === 'Ppav') {
    const returnArr = await videos.getRandomThreeVideos();
    const sendSuccess = await fb.sendGenericMessageByArr(senderID, returnArr);
    if (sendSuccess) {
      logs.saveLog(true, {
        senderID: senderID,
        messageText: messageText,
        result: 'PPAV',
      });
    }
  } else if (messageText === 'GGinin' || messageText === 'GGININ' || messageText === 'gginin' || messageText === 'Gginin') {
    subscribe.saveUser(senderID).then(str => {
      fb.sendTextMessage(senderID, str);
      const str2 = '想看片請輸入 "PPAV" 3:) \n\n其他搜尋功能🔥\n1. 搜尋番號："# + 番號" \n2. 搜尋女優："% + 女優"\n3. 搜尋片名："@ + 關鍵字"\n4. 搜尋標籤："! + 關鍵字"';
      fb.sendTextMessage(senderID, str2);
    });
  } else if (messageText === 'NoGG' || messageText === 'NOGG' || messageText === 'nogg' || messageText === 'noGG' || messageText === 'Nogg') {
    subscribe.removeUser(senderID).then(str => {
      fb.sendTextMessage(senderID, str);
      const str2 = '想看片請輸入 "PPAV" 3:) \n\n其他搜尋功能🔥\n1. 搜尋番號："# + 番號" \n2. 搜尋女優："% + 女優"\n3. 搜尋片名："@ + 關鍵字"\n4. 搜尋標籤："! + 關鍵字"\n\n訂閱每日推播："GGININ"';
      fb.sendTextMessage(senderID, str2);
    });
  } else if (messageText === 'Donate' || messageText === 'donate' || messageText === 'DONATE' || messageText === '抖內') {
    const str = '您的抖內將會運用在：\n1. 維護伺服器，提供更快、更穩定的PPAV\n2. 開發新功能\n3. 讓你照三餐尻🔥🔥🔥\n\n抖內連結請點按鈕～\n你的抖內是我們成長的動力 <3 <3 <3';
    const buttons = [{
            type: 'web_url',
            url: 'https://p.allpay.com.tw/Xa5Bv',
            title: '我要抖內',
          }];
    fb.sendButtonMessage(senderID, str, buttons);
  } else {
    let returnObj,
        str = '',
        sendSuccess = false,
        hasResult = false;

    messageText = messageText.replace(new RegExp('\\+', 'g'), '');
    switch (firstStr) {
      case '＃':
      case '#':
        returnObj = await videos.getVideo('code', messageText.split(firstStr)[1].toUpperCase());
        if (returnObj.results.length === 0) {
          str = '搜尋不到此番號';
          sendSuccess = await fb.sendTextMessage(senderID, str);
          hasResult = false;
        } else {
          str = `幫你搜尋番號：${returnObj.search_value}`;
          await fb.sendTextMessage(senderID, str);
          sendSuccess = await fb.sendGenericMessageByArr(senderID, returnObj.results);
          hasResult = true;
        }
        break;
      case '％':
      case '%':
        returnObj = await videos.getVideo('models', messageText.split(firstStr)[1]);
        if (returnObj.results.length === 0) {
          str = '搜尋不到此女優';
          sendSuccess = await fb.sendTextMessage(senderID, str);
          hasResult = false;
        } else {
          str = `幫你搜尋女優：${returnObj.search_value}`;
          await fb.sendTextMessage(senderID, str);
          sendSuccess = await fb.sendGenericMessageByArr(senderID, returnObj.results);
          hasResult = true;
        }
        break;
      case '＠':
      case '@':
        returnObj = await videos.getVideo('title', messageText.split(firstStr)[1]);
        if (returnObj.results.length === 0) {
          str = '搜尋不到此片名';
          sendSuccess = await fb.sendTextMessage(senderID, str);
          hasResult = false;
        } else {
          str = `幫你搜尋片名：${returnObj.search_value}`;
          await fb.sendTextMessage(senderID, str);
          sendSuccess = await fb.sendGenericMessageByArr(senderID, returnObj.results);
          hasResult = true;
        }
        break;
      case '！':
      case '!':
        returnObj = await videos.getVideo('tags', messageText.split(firstStr)[1]);
        if (returnObj.results.length === 0) {
          str = '搜尋不到此標籤';
          sendSuccess = await fb.sendTextMessage(senderID, str);
          hasResult = false;
        } else {
          str = `幫你搜尋標籤：${returnObj.search_value}`;
          await fb.sendTextMessage(senderID, str);
          sendSuccess = await fb.sendGenericMessageByArr(senderID, returnObj.results);
          hasResult = true;
        }
        break;
      default:
        str = '想看片請輸入 "PPAV" 3:) \n\n其他搜尋功能🔥\n1. 搜尋番號："# + 番號" \n2. 搜尋女優："% + 女優"\n3. 搜尋片名："@ + 關鍵字"\n4. 搜尋標籤："! + 關鍵字"\n\n訂閱每日推播："GGININ"';
        fb.sendTextMessage(senderID, str);
        break;
    }
    if (sendSuccess) {
      logs.saveLog(hasResult, {
        senderID: senderID,
        messageText: messageText,
        result: str,
      });
    }
  }
  
  fb.sendTyping(senderID, 'typing_off');
};

export default receivedMessage;
