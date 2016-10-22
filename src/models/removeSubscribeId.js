import { SubscribeIdCollection } from './schema';

const removeSubscribeId = (senderID) => {
  return new Promise(resolve => {
    SubscribeIdCollection.remove({ senderID: senderID }, err => {
      if (err) {
        const str = '你尚未訂閱過喔';
        resolve(str);
      } else {
        const str = '成功取消訂閱';
        resolve(str);
      }
    });
  });
};

export default removeSubscribeId;
