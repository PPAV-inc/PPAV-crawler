import * as videos from '../models/videos';
import bot from '../telegram_bot';

const receivedMessage = async (message) => {
  const chatId = message.chat.id;
  const timeOfMessage = message.date;

  let messageText = message.text;
  let firstStr = '';

  if (messageText !== undefined) {
    firstStr = messageText.split('')[0];
    messageText = messageText.replace(/\s/g, '');
    messageText = messageText.toUpperCase();
  }

  console.log(`收到訊息：'${messageText}'，從 id '${chatId}' at ${timeOfMessage}`);

  if (messageText === 'PPAV') {
    const returnArr = await videos.getRandomThreeVideos();
    const urlStr = returnArr.join('\n');
    console.log(urlStr);
    await bot.sendMessage(chatId, urlStr);
  } else {
    let returnObj;
    let str = '';

    messageText = messageText.replace(new RegExp('\\+', 'g'), '');
    switch (firstStr) {
    case '＃':
    case '#':
      returnObj = await videos.getVideo('code', messageText.split(firstStr)[1].toUpperCase());
      if (returnObj.results.length === 0) {
        str = '搜尋不到此番號';
        await bot.sendMessage(chatId, str);
      } else {
        str = `幫你搜尋番號：${returnObj.search_value}`;
        await bot.sendMessage(chatId, str);

        const urlStr = returnObj.results.join('\n');
        console.log(urlStr);
        await bot.sendMessage(chatId, urlStr);
      }
      break;
    case '％':
    case '%':
      returnObj = await videos.getVideo('models', messageText.split(firstStr)[1]);
      if (returnObj.results.length === 0) {
        str = '搜尋不到此女優';
        await bot.sendMessage(chatId, str);
      } else {
        str = `幫你搜尋女優：${returnObj.search_value}`;
        await bot.sendMessage(chatId, str);

        const urlStr = returnObj.results.join('\n');
        console.log(urlStr);
        await bot.sendMessage(chatId, urlStr);
      }
      break;
    case '＠':
    case '@':
      returnObj = await videos.getVideo('title', messageText.split(firstStr)[1]);
      if (returnObj.results.length === 0) {
        str = '搜尋不到此片名';
        await bot.sendMessage(chatId, str);
      } else {
        str = `幫你搜尋片名：${returnObj.search_value}`;
        await bot.sendMessage(chatId, str);

        const urlStr = returnObj.results.join('\n');
        console.log(urlStr);
        await bot.sendMessage(chatId, urlStr);
      }
      break;
    case '！':
    case '!':
      returnObj = await videos.getVideo('tags', messageText.split(firstStr)[1]);
      if (returnObj.results.length === 0) {
        str = '搜尋不到此標籤';
        await bot.sendMessage(chatId, str);
      } else {
        str = `幫你搜尋標籤：${returnObj.search_value}`;
        await bot.sendMessage(chatId, str);

        const urlStr = returnObj.results.join('\n');
        console.log(urlStr);
        await bot.sendMessage(chatId, urlStr);
      }
      break;
    default:
      str = `想看片請輸入 "PPAV"

        其他搜尋功能🔥
        1. 搜尋番號："# + 番號"
        2. 搜尋女優："% + 女優"
        3. 搜尋片名："@ + 關鍵字"
        4. 搜尋標籤："! + 關鍵字"`;
      bot.sendMessage(chatId, str);
      break;
    }
  }
};

export default receivedMessage;
