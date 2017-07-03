import request from 'request';
import config from '../../config';
import * as newVideos from '../../models/newVideos';
import * as getStartedIds from '../../models/getStartedIds';
import receivedMessage from './receivedMessage';
import FacebookOP from './facebook';

const PAGE_TOKEN = config.PAGE_TOKEN;
const fb = new FacebookOP();

const startedConv = (senderID, timeOfPostback) => {
  let name = '';

  request({
    url: `https://graph.facebook.com/v2.6/${senderID}?fields=first_name`,
    qs: { access_token: PAGE_TOKEN },
    method: 'GET',
  }, (error, response, body) => {
    if (error) {
      console.log(`Error sending message: ${error}`);
    } else if (response.body.error) {
      console.log(`Error: ${response.body.error}`);
    } else {
      name = JSON.parse(body);
      fb.sendTextMessage(senderID, `Hello ${name.first_name} do you have a pen?`);
      fb.sendTextMessage(senderID, '本聊天機器人已依網站內容分級規定處理\n警告：您即將進入之聊天內容須滿18歲方可瀏覽\n根據「電腦網路內容分級處理辦法」第六條第三款規定，本聊天機器人已於各限制級網頁依照台灣網站分級推廣基金會之規定標示。 若您尚未年滿十八歲，請點選離開。若您已滿十八歲，亦不可將本聊天機器人之內容派發、傳閱、出售、出租、交給或借予年齡未滿18歲的人士瀏覽，或將本聊天機器人內容向該人士出示、播放或放映。\n\n所有內容皆由第三方來源提供，非本聊天機器人所有。');
      try {
        getStartedIds.saveUserInfo(senderID, name.first_name, timeOfPostback);
      } catch (err) {
        console.log(err);
      }
    }
  });
};

const receivedPostback = (event) => {
  const senderID = event.sender.id;
  const timeOfPostback = event.timestamp;
  const payload = event.postback.payload;

  console.log(`收到 postback：${payload}，從 id '${senderID}' at timestamp ${timeOfPostback}`);

  if (payload === 'PPAV') {
    event.message = { text: payload };
    receivedMessage(event);
  } else if (payload === 'NEW') {
    newVideos.getRandomThreeVideos().then(returnArr => {
      fb.sendGenericMessageByArr(senderID, returnArr);
    });
  } else if (payload === 'DONATE') {
    event.message = { text: payload };
    receivedMessage(event);
  } else {
    startedConv(senderID, timeOfPostback);
  }
};

export default receivedPostback;
