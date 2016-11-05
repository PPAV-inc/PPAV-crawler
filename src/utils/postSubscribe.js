import 'babel-polyfill';
import delay from 'delay';
import findThreeNewVideos from '../models/findThreeNewVideos';
import findSubscribeId from '../models/findSubscribeId';
import FacebookOP from './facebook';

const fb = new FacebookOP();


const loopfunc = (senderIDArr, returnArr, nowCnt, arrCnt) => {
  if (nowCnt < arrCnt) {
    const str = '今日新增';
    fb.sendGenericMessageByArr(senderIDArr[nowCnt].senderID, returnArr)
      .then(delay(500))
      .then(() => {
        fb.sendTextMessage(senderIDArr[nowCnt].senderID, str);
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
