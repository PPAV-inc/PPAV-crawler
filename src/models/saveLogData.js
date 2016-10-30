import { LogCollection } from './schema';

const saveLogData = (successOrNot, Obj) => {
  const timestamp = new Date();
  let Log;
  
  Log = new LogCollection({
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
      console.log(`push ${Obj.messageText} finished`);
    }
  });
};

export default saveLogData;
