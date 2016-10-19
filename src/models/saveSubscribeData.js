import { subscribeIdCollection } from './schema';

const saveSubscribeData = (senderID) => {
  return new Promise(resolve => {
    subscribeIdCollection.count({senderID: senderID}, (err, count) => {
      if (count > 0) {
        const str = '你已訂閱過了喔';
        resolve(str);
      } else {
        const SubscribeId = new subscribeIdCollection({
          senderID,
        });
        
        // Save it to database
        SubscribeId.save((err) => {
          if (err) {
            console.log(err);
          } else {
            console.log('push' + senderID + ' finished');
          }
        });
        const str = '成功訂閱\n敬請期待每日新片';
        resolve(str);
      }
    });
  });
};

export default saveSubscribeData;
