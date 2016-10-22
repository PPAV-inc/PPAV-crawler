import 'babel-polyfill';
import findThreeNewVideos from '../models/findThreeNewVideos';
import findSubscribeId from '../models/findSubscribeId';
import sendTextMessage from './sendTextMessage';
import { sendGenericMessageByArr } from './receivedMessage';

findThreeNewVideos().then(returnArr => {
  findSubscribeId().then(senderIDArr => {
    senderIDArr.forEach(returnSenderID => {
      const str = '今日推薦';
      sendTextMessage(returnSenderID.senderID, str);
      sendGenericMessageByArr(returnSenderID.senderID, returnArr);
    });
  });
});
