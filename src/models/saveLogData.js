import { LogCollection } from './schema';

const saveLogData = (successOrNot, Obj) => {
  let Log;
  Log = new LogCollection({
    successOrNot,
    senderID: Obj.senderID,
    messageText: Obj.messageText,
    result: Obj.result,
  });
  
    
  // Save it to database
  Log.save((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`push ${Obj.messageText} finished`);
    }
  });
};

export default saveLogData;
