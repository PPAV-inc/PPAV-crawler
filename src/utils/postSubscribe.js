import 'babel-polyfill';
import delay from 'delay';
import findThreeNewVideos from '../models/findThreeNewVideos';
import findSubscribeId from '../models/findSubscribeId';
import { sendGenericMessageByArr } from './receivedMessage';
import sendTextMessage from './sendTextMessage';


const loopfunc = (senderIDArr, returnArr, nowCnt, arrCnt) => {
  if (nowCnt < arrCnt) {
    const str = '今日新增';
    sendTextMessage(senderIDArr[nowCnt].senderID, str)
      .then(delay(1000))
      .then(() => {
        sendGenericMessageByArr(senderIDArr[nowCnt].senderID, returnArr);
        nowCnt++;
        loopfunc(senderIDArr, returnArr, nowCnt, arrCnt);
    });
  }
};

const postSubscribe = () => {
  findThreeNewVideos().then(returnArr => {
    findSubscribeId().then(senderIDArr => {
      const arrCnt = senderIDArr.length;
      let nowCnt = 0;
      loopfunc(senderIDArr, returnArr, nowCnt, arrCnt);
    });
  });
};

export default postSubscribe;

