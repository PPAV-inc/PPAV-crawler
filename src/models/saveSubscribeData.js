import { subscribeIdCollection } from './schema';

const saveSubscribeData = (senderID) => {
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
};

export default saveSubscribeData;
