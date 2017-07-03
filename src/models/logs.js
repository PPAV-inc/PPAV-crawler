import { LogCollection } from './schema';

const saveLog = (successOrNot, Obj) => {
  const timestamp = new Date();

  const Log = new LogCollection({
    successOrNot,
    senderID: Obj.senderID,
    messageText: Obj.messageText,
    result: Obj.result,
    timestamp,
  });

  Log.save((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`儲存訊息 '${Obj.messageText}' 成功`);
    }
  });
};

export { saveLog };
