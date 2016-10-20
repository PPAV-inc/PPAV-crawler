import { SubscribeIdCollection } from './schema';

const saveSubscribeData = senderID => {
  return new Promise(resolve => {
    SubscribeIdCollection.count({ senderID: senderID }, (err, count) => {
      if (count > 0) {
        const str = '你已訂閱過了喔';
        resolve(str);
      } else {
        const subscribeId = new SubscribeIdCollection({
          senderID,
        });
        
        // Save it to database
        subscribeId.save(errSave => {
          if (errSave) {
            console.log(errSave);
          } else {
            console.log(`push ${senderID} finished`);
          }
        });
        const str = '成功訂閱\n敬請期待每日新片';
        resolve(str);
      }
    });
  });
};

export default saveSubscribeData;
