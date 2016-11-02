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
        const str = '您已成功訂閱\n我們將在每天凌晨12點至凌晨1點之間推播三部片給您 3:)\n敬請期待每日新片 :)\n\n取消訂閱請輸入"NOGG"';
        resolve(str);
      }
    });
  });
};

export default saveSubscribeData;
