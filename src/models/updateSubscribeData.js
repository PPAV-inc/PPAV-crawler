import { SubscribeIdCollection } from './schema';

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

export default updateSubscribeData;
