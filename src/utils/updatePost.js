import findThreeNewVideos from '../models/findThreeNewVideos';
import findSubscribeId from '../models/findSubscribeId';
import { sendGenericMessageByArr } from './receivedMessage';

findThreeNewVideos().then(returnArr => {
  findSubscribeId().then(senderIDArr => {
    console.log(senderIDArr);
    senderIDArr.forEach(senderID => {
      sendGenericMessageByArr(senderID, returnArr);
    });
  });
});
