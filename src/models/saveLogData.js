import { ErrorLogCollection, SuccessLogCollection } from './schema';

const saveLogData = (successOrNot, Obj) => {
  let Log;
  if (successOrNot) {
    Log = new SuccessLogCollection({
      senderID: Obj.senderID,
      messageText: Obj.messageText,
      result: Obj.result,
    });
  } else {
    Log = new ErrorLogCollection({
      senderID: Obj.senderID,
      messageText: Obj.messageText,
      result: Obj.result,
    });
  }
  
    
  // Save it to database
  Log.save((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('push' + Obj.messageText + ' finished');
    }
  });
};

export default saveLogData;
