import * as videos from '../models/videos';

const receivedMessage = async (message, messageText, type) => {
  const chatId = message.chat.id;
  const timeOfMessage = new Date(message.date);

  console.log(`收到訊息：'${messageText}'，從 id '${chatId}' at ${timeOfMessage}`);

  let videosObj;
  let typeStr;

  if (type === 'code') {
    videosObj = await videos.getVideo(type, messageText.toUpperCase());
    typeStr = '番號';
  } else if (type === 'models') {
    videosObj = await videos.getVideo(type, messageText);
    typeStr = '女優';
  } else if (type === 'title') {
    videosObj = await videos.getVideo(type, messageText);
    typeStr = '片名';
  } else {
    videosObj = await videos.getRandomThreeVideos();
    let urlStr = '';

    videosObj.results.forEach(video => {
      urlStr += `${video.url}\n`;
    });

    console.log(urlStr);

    return [urlStr];
  }

  let str = '';
  if (videosObj.results.length === 0) {
    str = `搜尋不到此${typeStr}`;
    return [str];
  } else {
    str = `幫你搜尋${typeStr}：${videosObj.searchValue}`;

    let urlStr = '';
    videosObj.results.forEach(video => {
      urlStr += `${video.url}\n`;
    });
    console.log(urlStr);
    const totalStr = `總共搜尋到：${videosObj.results.length} 個連結喔喔喔`;

    return [str, urlStr, totalStr];
  }
};

export default receivedMessage;
