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

const updateSubscribeData = (id, isPushable) => {
  return new Promise(resolve => {
    SubscribeIdCollection.update(
      { senderID: id },
      { $set: { isPushable } },
      { upsert: false },
      err => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      }   
    );  
  }); 
};

const saveSubscribeData = senderID => {
  return new Promise(resolve => {
    SubscribeIdCollection.count({ senderID: senderID }, (err, count) => {
      if (count > 0) {
        const str = '你已訂閱過了喔 3:)';
        resolve(str);
      } else {
        const subscribeId = new SubscribeIdCollection({
          senderID,
          isPushable: true,
        });

        // Save it to database
        subscribeId.save(errSave => {
          if (errSave) {
            console.log(errSave);
          } else {
            console.log(`${senderID} 訂閱完成`); 
          }
        });
        const str = '您已成功訂閱\n我們將在每天傍晚至凌晨推播三部片給您 3:)\n敬請期待每日新片 :)\n\n提醒您 ⚠\n因為Facebook的限制，\n如超過24小時未傳任何訊息給PPAV\n您將無法收到每日推播QQ\n\n取消訂閱請輸入"NOGG"';
        resolve(str);
      }   
    }); 
  }); 
};

const findSubscribeId = () => {
  return new Promise(resolve => {
    let senderIdArr = []; 
    SubscribeIdCollection.find({ isPushable: { $eq: true } }).exec((err, data) => {
      if (err) {
        console.log(err);
      } else {
        data.forEach(id => {
          senderIdArr.push(id);
        });
        resolve(senderIdArr);
      }   
    }); 
  }); 
};

export { removeSubscribeId, updateSubscribeData, saveSubscribeData, findSubscribeId };

