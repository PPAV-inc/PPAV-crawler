import * as videos from '../models/videos';

const receivedMessage = async (message, messageText, type) => {
  const chatId = message.chat.id;
  const timeOfMessage = message.date;

  console.log(`收到訊息：'${messageText}'，從 id '${chatId}' at ${timeOfMessage}`);

  let returnObj;

  let typeStr;
  if (type === 'code') {
    returnObj = await videos.getVideo(type, messageText.toUpperCase());
    typeStr = '番號';
  } else if (type === 'models') {
    returnObj = await videos.getVideo(type, messageText);
    typeStr = '女優';
  } else if (type === 'title') {
    returnObj = await videos.getVideo(type, messageText);
    typeStr = '片名';
  } else {
    const videoArr = await videos.getRandomThreeVideos();
    let urlStr = '';

    videoArr.forEach(video => {
      urlStr += `${video.url}\n`;
    });

    console.log(urlStr);

    return [urlStr];
  }

  let str = '';
  if (returnObj.results.length === 0) {
    str = `搜尋不到此${typeStr}`;
    return [str];
  } else {
    str = `幫你搜尋${typeStr}：${returnObj.search_value}`;

    let urlStr = '';
    returnObj.results.forEach(video => {
      urlStr += `${video.url}\n`;
    });
    console.log(urlStr);
    const totalStr = `總共搜尋到：${returnObj.results.length} 個連結喔喔喔`;

    return [str, urlStr, totalStr];
  }
};

export default receivedMessage;
