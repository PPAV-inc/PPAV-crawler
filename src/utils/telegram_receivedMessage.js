import * as logs from '../models/logs';
import * as videos from '../models/videos';
import * as subscribe from '../models/subscribe';
import bot from '../telegram_bot';

const sendArrMessages = (chatId, messageArr) => {
    return new Promise(resolve => {
        let str = "";
        messageArr.forEach(msgObj => {
            str += msgObj.url + "\n";
        });

        console.log(str);
        bot.sendMessage(chatId, str).then(() => {
            resolve(true);
        }).catch(() => {
            resolve(false);
        });
    });
};

const sendMessage = (chatId, messageText) => {
    return new Promise(resolve => {
        bot.sendMessage(chatId, messageText).then(() => {
            resolve(true);
        }).catch(() => {
            resolve(false);
        });
    });
};

const receivedMessage = async (message) => {
    const chatId = message.chat.id,
        timeOfMessage = message.date;

    let messageText = message.text,
        firstStr = '';

    if (messageText !== undefined) {
        firstStr = messageText.split('')[0];
        messageText = messageText.replace(/\s/g, '');
        messageText = messageText.toUpperCase();
        const isUpdate = subscribe.updateUser(chatId, true);
        if (isUpdate) {
          console.log(`${chatId} 更新 isPushable 成功`);
        } else {
          console.log(`${chatId} 更新 isPushable 失敗`);
        }
    }

    console.log(`收到訊息：'${messageText}'，從 id '${chatId}' at ${timeOfMessage}`);

    if (messageText === 'PPAV') {
        const returnArr = await videos.getRandomThreeVideos();
        const sendSuccess = await sendArrMessages(chatId, returnArr);

        if (sendSuccess) {
            logs.saveLog(true, {
                senderID: chatId,
                messageText: messageText,
                result: 'PPAV',
             });
        }
    } else if (messageText === 'GGININ') {
        subscribe.saveUser(chatId).then(str => {
            sendMessage(chatId, str);
            const str2 = '想看片請輸入 "PPAV" 3:) \n\n其他搜尋功能🔥\n1. 搜尋番號："# + 番號" \n2. 搜尋女優："% + 女優"\n3. 搜尋片名："@ + 關鍵字"\n4. 搜尋標籤："! + 關鍵字"';
            sendMessage(chatId, str2);
        });
    } else if (messageText === 'NOGG') {
        subscribe.removeUser(chatId).then(str => {
            sendMessage(chatId, str);
            const str2 = '想看片請輸入 "PPAV" 3:) \n\n其他搜尋功能🔥\n1. 搜尋番號："# + 番號" \n2. 搜尋女優："% + 女優"\n3. 搜尋片名："@ + 關鍵字"\n4. 搜尋標籤："! + 關鍵字"\n\n訂閱每日推播："GGININ"';
            sendMessage(chatId, str2);
        });
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
                    sendSuccess = await sendMessage(chatId, str);
                    hasResult = false;
                } else {
                    str = `幫你搜尋番號：${returnObj.search_value}`;
                    await sendMessage(chatId, str);
                    sendSuccess = await sendArrMessages(chatId, returnObj.results);
                    hasResult = true;
                }
                break;
            case '％':
            case '%':
                returnObj = await videos.getVideo('models', messageText.split(firstStr)[1]);
                if (returnObj.results.length === 0) {
                    str = '搜尋不到此女優';
                    sendSuccess = await sendMessage(chatId, str);
                    hasResult = false;
                } else {
                    str = `幫你搜尋女優：${returnObj.search_value}`;
                    await sendMessage(chatId, str);
                    sendSuccess = await sendArrMessages(chatId, returnObj.results);
                    hasResult = true;
                }
                break;
            case '＠':
            case '@':
                returnObj = await videos.getVideo('title', messageText.split(firstStr)[1]);
                if (returnObj.results.length === 0) {
                  str = '搜尋不到此片名';
                  sendSuccess = await sendMessage(chatId, str);
                  hasResult = false;
                } else {
                  str = `幫你搜尋片名：${returnObj.search_value}`;
                  await sendMessage(chatId, str);
                  sendSuccess = await sendArrMessages(chatId, returnObj.results);
                  hasResult = true;
                }
                break;
            case '！':
            case '!':
                returnObj = await videos.getVideo('tags', messageText.split(firstStr)[1]);
                if (returnObj.results.length === 0) {
                  str = '搜尋不到此標籤';
                  sendSuccess = await sendMessage(chatId, str);
                  hasResult = false;
                } else {
                  str = `幫你搜尋標籤：${returnObj.search_value}`;
                  await sendMessage(chatId, str);
                  sendSuccess = await sendArrMessages(chatId, returnObj.results);
                  hasResult = true;
                }
                break;
            default:
                str = '想看片請輸入 "PPAV" 3:) \n\n其他搜尋功能🔥\n1. 搜尋番號："# + 番號" \n2. 搜尋女優："% + 女優"\n3. 搜尋片名："@ + 關鍵字"\n4. 搜尋標籤："! + 關鍵字"\n\n訂閱每日推播："GGININ"';
                sendMessage(chatId, str);
                break;
        }
        if (sendSuccess) {
          logs.saveLog(hasResult, {
            senderID: chatId,
            messageText: messageText,
            result: str,
          });
        }
    }
};

export default receivedMessage;
