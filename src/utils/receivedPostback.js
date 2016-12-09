import request from 'request';
import config from '../config';
import findThreeNewVideos from '../models/findThreeNewVideos';
import receivedMessage from './receivedMessage';
import saveGetStartedData from '../models/saveGetStartedData';
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
      try {
        saveGetStartedData(senderID, name.first_name, timeOfPostback);
      } catch (err) {
        console.log(err);
      }
    }
  });
};

const receivedPostback = (event) => {
  const senderID = event.sender.id,
        timeOfPostback = event.timestamp,
        payload = event.postback.payload;

  console.log(`收到 postback：${payload}，從 id '${senderID}' at timestamp ${timeOfPostback}`);

  if (payload === 'PPAV') {
    event.message = { text: payload };
    receivedMessage(event);
  } else if (payload === 'NEW') {
    findThreeNewVideos().then(returnArr => {
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
