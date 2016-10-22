import { findThreeNewVideos, findSubscribeId } from '../mongodb';
import { sendGenericMessageByArr } from './receivedMessage';

findThreeNewVideos().then(returnArr => {
  findSubscribeId().then(senderIDArr => {
    senderIDArr.forEach(senderID => {
      sendGenericMessageByArr(senderID, returnArr);
    });
  });
});
