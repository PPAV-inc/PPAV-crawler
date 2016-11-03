import request from 'request-promise';
import findThreeNewVideos from '../models/findThreeNewVideos';
import findSubscribeId from '../models/findSubscribeId';
import sendTextMessage from './sendTextMessage';
import { sendGenericMessageByArr } from './receivedMessage';
import config from '../config';
const data = config.TEST_MESSAGE;

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const sendFakeUserMessage = async () => {
    
  let [videoArr, senderIDArr] = await Promise.all([findThreeNewVideos(), findSubscribeId()]);
  senderIDArr = [];
  senderIDArr = ["1319622658071351", "1352776404747642", "1084793478302481", "1316227151751281"];
  let arrCnt = senderIDArr.length;
  const url = "http://localhost:8080/webhook";
  
  for(let idx=0; idx < senderIDArr.length; ++idx) {
    console.log(`Sending to user: ${senderIDArr[idx]}`);
    data.entry[0].messaging[0].sender.id = senderIDArr[idx];

    await request.post({url: url, form: data}, function(err, httpRes, body) {
      if(err) console.log(err);
    });
    await sleep(1000);
  }
};

sendFakeUserMessage();
