import 'babel-polyfill';
import delay from 'delay';
import findThreeNewVideos from '../models/findThreeNewVideos';
import findSubscribeId from '../models/findSubscribeId';
import FacebookOP from './facebook';

const fb = new FacebookOP();

const postSubscribe = async () => {
  const returnArr = await findThreeNewVideos();
  const senderIDArr = await findSubscribeId();

  for (let idx = 0; idx < senderIDArr.length; ++idx) {
    const str = '今日新增';
    await fb.sendGenericMessageByArr(senderIDArr[idx].senderID, returnArr).then(delay(500));
    await fb.sendTextMessage(senderIDArr[idx].senderID, str);
  }
};

export default postSubscribe;
