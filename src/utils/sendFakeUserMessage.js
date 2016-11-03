import request from 'request-promise';
import findThreeNewVideos from '../models/findThreeNewVideos';
import findSubscribeId from '../models/findSubscribeId';
import sendTextMessage from './sendTextMessage';
import { sendGenericMessageByArr } from './receivedMessage';
import config from '../config';

const data = config.TEST_MESSAGE;
const server = config.SERVER_ADDRESS;
const testUserArr = config.TEST_ARRAY;

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const sendFakeUserMessage = async () => {

  let [videoArr, senderIDArr] = await Promise.all([findThreeNewVideos(), findSubscribeId()]);
  // senderIDArr = testUserArr;
  const url = server + "/webhook";

  for(let idx = 0; idx < senderIDArr.length; ++idx) {
    console.log(`Sending to user: ${senderIDArr[idx]}`);
    data.entry[0].messaging[0].sender.id = senderIDArr[idx];

    await request.post({url: url, form: data}, function(err, httpRes, body) {
      if(err) console.log(err);
    });
    await sleep(1000);
  }
};

export default sendFakeUserMessage;
