import { findThreeNewVideos, findSubscribeId } from '../mongodb';
import { sendGenericMessageByArr } from '../handleActions';

findThreeNewVideos().then(returnArr => {
  findSubscribeId().then(senderIDArr => {
    senderIDArr.forEach(senderID => {
      sendGenericMessageByArr(senderID, returnArr);
    });
  });
});
