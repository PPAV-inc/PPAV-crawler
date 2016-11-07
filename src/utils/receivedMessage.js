import findThreeVideos from '../models/findThreeVideos';
import saveLogData from '../models/saveLogData';
import saveSubscribeData from '../models/saveSubscribeData';
import removeSubscribeId from '../models/removeSubscribeId';
import findVideo from '../models/findVideo';
import FacebookOP from './facebook';

const fb = new FacebookOP();

const receivedMessage = async (event) => {
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
    const returnArr = await findThreeVideos();
    const sendSuccess = await fb.sendGenericMessageByArr(senderID, returnArr);
    if (sendSuccess) {
      saveLogData(true, {
        senderID: senderID,
        messageText: messageText,
        result: 'PPAV',
      });
    }
  } else if (messageText === 'GGinin' || messageText === 'GGININ' || messageText === 'gginin' || messageText === 'Gginin') {
    saveSubscribeData(senderID).then(str => {
      fb.sendTextMessage(senderID, str);
      const str2 = '想看片請輸入 "PPAV" 3:) \n\n其他搜尋功能🔥\n1. 搜尋番號："# + 番號" \n2. 搜尋女優："% + 女優"\n3. 搜尋片名："@ + 關鍵字"';
      fb.sendTextMessage(senderID, str2);
    });
  } else if (messageText === 'NoGG' || messageText === 'NOGG' || messageText === 'nogg' || messageText === 'noGG' || messageText === 'Nogg') {
    removeSubscribeId(senderID).then(str => {
      fb.sendTextMessage(senderID, str);
      const str2 = '想看片請輸入 "PPAV" 3:) \n\n其他搜尋功能🔥\n1. 搜尋番號："# + 番號" \n2. 搜尋女優："% + 女優"\n3. 搜尋片名："@ + 關鍵字"\n\n訂閱每日推播："GGININ"';
      fb.sendTextMessage(senderID, str2);
    });
  } else {
    let returnObj,
        str = '',
        sendSuccess = false,
        hasResult = false;

    switch (firstStr) {
      case '＃':
      case '#':
        returnObj = await findVideo('code', messageText.split(firstStr)[1].toUpperCase());
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
        returnObj = await findVideo('models', messageText.split(firstStr)[1]);
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
        returnObj = await findVideo('title', messageText.split(firstStr)[1]);
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
      default:
        str = '想看片請輸入 "PPAV" 3:) \n\n其他搜尋功能🔥\n1. 搜尋番號："# + 番號" \n2. 搜尋女優："% + 女優"\n3. 搜尋片名："@ + 關鍵字"\n\n訂閱每日推播："GGININ"';
        fb.sendTextMessage(senderID, str);
        break;
    }
    if (sendSuccess) {
      saveLogData(hasResult, {
        senderID: senderID,
        messageText: messageText,
        result: str,
      });
    }
  }
};

export default receivedMessage;
